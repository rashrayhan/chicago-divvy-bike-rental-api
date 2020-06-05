const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.port || 2020;
const hostname = '127.0.0.1';
const fs = require("fs");
const path = require("path");
const morgan = require('morgan');
const cluster = require('cluster');
const app = express();

//childprocesses for multicore environment
module.exports.setupWorkerProcesses = () => {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
        console.log('New worker started');
    });
}


module.exports.setUpExpress = ()=>{
    //Middlewares 
    app.use(express.json());
    app.use(cors());
    app.use(helmet());

    //logging all requests to file
    const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));

    //Routes
    app.get("/", (req, res) => {
        res.json({ status: "success", message: "Welcome To Testing API" });
      });
    app.use('/api/v1/auth', require('../routes/userRoutes'));
    app.use('/api/v1/station', require('../routes/stationRoutes'));

    //Production Environment
    if(process.env.NODE_ENV === 'production'){
        //static folder
        app.use(express.static(__dirname + '/public/'));

        //SPA General Routing
        app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
    }
    
    //server bootstrap
    app.listen(port, hostname, () => {
        console.log(`Config complete... App is running on: http://${hostname}:${port}`)
    })

    module.exports = app;
}