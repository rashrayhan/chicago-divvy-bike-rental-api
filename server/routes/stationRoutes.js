const stationRouter = require('express').Router();
const stationController = require('../controllers/stationController');
const {verifyToken} = require('../middlewares/auth')

////Task 1 Route: Return the information for one station given a station id
stationRouter.get('/:id', verifyToken, stationController.getStationById);

//Task 2 Route: return the number of riders per age group who ended their trip at a station for a given day
stationRouter.get('/riders/:id/:date', verifyToken, stationController.getEndStationById);

/**Task 3 Route: return the last 20 trips that ended at each station for a single day */
stationRouter.get('/last20/:id/:date', verifyToken, stationController.getStationLast20Trips);

module.exports = stationRouter;