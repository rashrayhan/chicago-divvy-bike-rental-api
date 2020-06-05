const { group } = require('../model/user');
const { reset } = require('../middlewares/helpers')
const jwt = require('jsonwebtoken');
const axios = require('axios');
const csv = require('csv-parser');
const _ = require('lodash');
const fs = require("fs");

const URL = 'https://gbfs.divvybikes.com/gbfs/en/station_information.json';
const end_station_id = '02 - Rental End Station ID';
const end_time = '01 - Rental Details Local End Time';
const member_birth = '05 - Member Details Member Birthday Year';

let fullyear = new Date().getFullYear();


//Task 1 Controller: Return the information for one station given a station id
module.exports.getStationById = (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', (err, user)=>{
            if(err){
                res.sendStatus(403);
            }else{
                axios.get(URL)
                .then(response => {
                    let station = response.data.data.stations.filter(st_id => st_id['station_id'] == req.params.id);
                    res.json({station_info: station, user});
                })
            }
        }) 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**Task 2 Controller: return the number of riders per age group who ended their trip at a station for a given day */
module.exports.getEndStationById = (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, user)=>{
            if(err){
                res.sendStatus(403);
            }else{
                reset(group);
                await fs.createReadStream('./server/Divvy_Trips_2019_Q2')
                .pipe(csv())
                .on('data', function (row) {
                    if(row[end_station_id] == req.params.id && row[end_time].includes(req.params.date)){
                        let val = "";
                        if(row[member_birth] != ""){
                            val = fullyear - row[member_birth];
                        }else{
                            val = -1;
                        }
                        
                        switch(true){
                            case val >= 51: 
                                group["51+"]++;
                                break;    
                            case val >= 41: 
                                group["41-50"]++;
                                break;
                            case val >= 31: 
                                group["31-40"]++;
                                break;
                            case val >= 21: 
                                group["21-30"]++;
                                break;
                            case val >= 0: 
                                group["0-20"]++;
                                break;
                            default:
                                group["unknown"]++;        
                        }
                    }})
                .on('end', function () {
                    res.json({
                        "Number of riders":{ group },
                        user

                    })
                })
            }
        }) 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**Task 3 Controller: Return the last 20 trips that ended at each station for a single day */
module.exports.getStationLast20Trips = (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, user)=>{
            if(err){
                res.sendStatus(403);
            }else{
                let data = [];
                await fs.createReadStream('./server/Divvy_Trips_2019_Q2')
                .pipe(csv())
                .on('data', function (row) {
                    if(row[end_station_id] == req.params.id && row[end_time].includes(req.params.date)){
                        data.push(row);
                    }})
                .on('end', function () {
                    res.json({
                        'last 20': _.takeRight(data, 20), 
                        user
                    })
                })
            }
        }) 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

