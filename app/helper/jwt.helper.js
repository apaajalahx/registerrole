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
    return this.refreshTokens = refreshTokens.filter(item => item != token);
}

exports.Refresh = (token, res) => {
    console.log(this.refreshTokens.includes(token));
    console.log(this.refreshTokens);
    if(!this.refreshTokens.includes(token)){
        return false;
    }
    return jwt.verify(token, Secret.refresh, (err, data) => {
        if(err) {
            console.log(err);
            return false;
        } else {
            const req_token = {id: data.id, email: data.email, role:data.role};
            const rtoken = jwt.sign(req_token, Secret.secret, {
                expiresIn: 120
            });
            return rtoken;
        }
    });
}