const userRouter = require('express').Router();
const userController = require('../controllers/userController');

//mock login and assign tokent to user
userRouter.get('/', userController.login);

module.exports = userRouter;