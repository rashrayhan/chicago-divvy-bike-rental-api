const { user } = require('../model/user');
const jwt = require('jsonwebtoken');

//mock user login for token generation add status
module.exports.login = async (req, res) => {
    try {
        await jwt.sign({user}, 'secretkey', {expiresIn: '2 days'}, (err, token) => {
            res.json({
                token
            });
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.testing = (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', (err, user)=>{
            if(err){
                res.sendStatus(403);
            }else{
                res.json({
                    message: 'this works',
                    user
                })
            }
        }) 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}