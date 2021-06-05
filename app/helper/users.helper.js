const { users } = require('../models/index');
const Secret = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const isValid = require('is-valid-domain');
const { secret } = require('../config/auth.config');
exports.update = (req,id,res) => {
    users.findOne({where: {id: id}, include: ['role']}).then((data) => {
        console.log(data);
        if(req.body.type == 'info'){
            data.name = req.body.name;
            data.email = req.body.email;
            data.phone = req.body.phone;
            data.role.name = req.body.role;
            data.save();
            res.status(200).send({
                massage: 'success update info users'
            });
        } else if(req.body.type == 'password'){
            data.password = bcryp.hashSync(req.body.password);
            data.save();
            res.status(200).send({
                massage: 'success change password'
            });
        } else {
            res.status(500).send({
                massage: "Error"
            });
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send({
            massage: error.massage || "Internal Server Error"
        });
    });
}

exports.create_activation = (id, password) => {
    return jwt.sign({id: id, password: password, status: 'actived'},Secret.secret, {
        expiresIn: 3600
    })
}

exports.verify_activation = (token) => {
    return jwt.verify(token,Secret.secret,(err, decode) => {
        if(err) {
            return false;
        } else {
            return decode;
        }
    });
}
let domain = process.env.URL;
exports.url = isValid(domain.replace(/^(https?|ftp):\/\//,'')) || domain + ":" + process.env.PORT;