const JWT = require('jsonwebtoken');
const Secret = require('../config/auth.config');
exports.DJwt = (req) => {
    token = req.headers['x-access-token'];
    return JWT.decode(token,Secret.secret);
}

exports.SJwt = (data) => {
    return JWT.sign(data, Secret.secret, {
        expiresIn: 86400
    });
}