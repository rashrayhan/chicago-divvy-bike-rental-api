const cluster = require('cluster');
const { setupWorkerProcesses, setUpExpress } = require('./middlewares/setup');

if (cluster.isMaster) {
  setupWorkerProcesses();
}else {
  setUpExpress();
}