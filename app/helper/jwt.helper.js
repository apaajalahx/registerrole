const jwt = require('jsonwebtoken');
const Secret = require('../config/auth.config');
exports.DJwt = (req) => {
    token = req.headers['x-access-token'];
    return jwt.decode(token,Secret.secret);
}

let refreshTokens = [];

exports.refreshTokens = refreshTokens;

exports.SJwt = (data) => {
    const token = jwt.sign(data, Secret.secret, {
        expiresIn: 120
    });
    const refreshtoken = jwt.sign(data, Secret.refresh);
    this.refreshTokens.push(refreshtoken);
    const return_token = {
        AccessToken: token,
        RefreshToken: refreshtoken
    };
    return return_token;
}

exports.BJwt = (token) => {
    refreshTokens = refreshTokens.filter(token => t !== token);
    return true;
}

exports.Refresh = (token, res) => {
    console.log(this.refreshTokens.includes([token]));
    if(!this.refreshTokens.includes(token)){
        return false;
    }
    jwt.verify(token, Secret.refresh, (err, data) => {
        if(err) {
            return false;
        }
        return new_token = jwt.sign({id:data.id, email:data.email, role:data.role}, Secret.secret, {
            expiresIn: 120
        });
    });
}