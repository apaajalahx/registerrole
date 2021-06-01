const jwt = require('jsonwebtoken');
const Secret = require('../config/auth.config');

exports.Auth = (req, res, next) => {
    if(!req.headers['x-access-token']){
        res.status(500).send({
            massage: 'token not found!'
        });
    }
    if(req.headers['x-access-token']){
        jwt.verify(req.headers['x-access-token'],Secret.secret,(error) => {
            if(error){
                res.status(500).send({
                    massage: 'token not match!'
                });
            } else {
                next();
            }
        });
    }
}