const bcryp = require('bcryptjs');
const { users,roles } = require('../models/index');
const mail_helper = require('../helper/mail.helper');
const jwt_helper = require('../helper/jwt.helper');
const mail_massage = require('../../resource/mail/mail');
exports.Register = (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcryp.hashSync(req.body.password),
        rolesid: 2 // default member
    }
    users.create(user).then( data => {
        res.send(data);
    }).catch( err => {
        console.log(err)
        res.status(500).send({
            massage: err.massage || "Internal Server Error"
        });
    });
}

exports.Auth = (req, res) => {
    if(!req.body.email){
        res.status(500).send({
           massage: 'please fill email' 
        });
    }
    if(!req.body.password){
        res.status(500).send({
            massage: 'please fill password'
        });
    }
    users.findOne({
        where: {
            email: req.body.email
        },
        include: ['role']
    }).then((data) => {
        let compare = bcryp.compareSync(req.body.password, data.password);
        if(compare){
            let req_token = {
                id: data.id,
                email: data.email,
                role: data.role.name
                }
            let token = jwt_helper.SJwt(req_token);
            res.status(200).send({
                massage: "success login",
                auth: data.email,
                role: data.role.name,
                token: token
            });
        } else {
            res.status(500).send({
                massage: "failed login, username and password not match"
            });
        }
    }).catch((error) => {
        res.status(500).send({
            massage: error || "Internal server error"
        });
        console.log(error);
    });
}

exports.Index = (req, res) => {
    var { id } = jwt_helper.DJwt(req);
    users.findOne({
        where: {
            id: id
        },
        include: ['role']
    }).then((data) => {
        let login = {
            id: data.id,
            name: data.name,
            role: data.role.name
        }
        res.send({
            massage: 'success',
            login
        });
    }).catch((error) => {
        console.log(error)
        res.status(500).send({
            massage: error.massage || "Internal Server Error"
        });
    });
}

exports.Find = (req, res) => {
    users.findOne({
        where: {
            id: req.params.id
        },
        include: ['role']
    }).then((data) => {
        let user_info = {
            id: data.id,
            name: data.name,
            role: data.role.name
        }
        res.send({
            massage: 'success',
            user_info
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).send({
            massage: error.massage || "Internal Server Error"
        })
    });
}
const updates = (req,id,res) => {
    console.log(req);
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
exports.Update = (req, res) => {
    var { role,id } = jwt_helper.DJwt(req);
    if(!req.body.type){
        res.status(500).send({
            massage: 'error, type value must be added (info/password)'
        });
    }
    if(req.params.id){
        if(role=="admin"){
            updates(req,req.params.id,res);
        } else {
            res.status(500).send({
                massage: 'you not have permission'
            });
        }
    } else {
            updates(req, id, res);
    }
}

exports.DeleteFind = (req, res) => {
    var { role } = jwt_helper.DJwt(req);
    if(role=="admin"){
        users.destroy({
            where: {
                id: req.params.id
            }
        }).then((r) => {
            if(r==1){
                res.status(200).send({
                   massage: `success delete data from id ${req.params.id}` 
                });
            } else {
                res.status(500).send({
                    massage: `failed delete data from id ${req.params.id}`
                });
            }
        }).catch((error) => {
            res.status(500).send({
               massage: error || "unknow error"
            });
        });
    } else {
        res.status(500).send({
            massage: "you not have permission"
        });
    }
}

exports.ResetPassword = (req, res) => {
    if(req.body.email){
        let new_password = Math.random().toString(36).substring(8);
        let user = users.findOne({where: {email: req.body.email}}).then((data) => {
            data.password = bcryp.hashSync(new_password);
            data.save();
        }).catch((error) => {
            console.log(error);
            return error;
        });
        massage = mail_massage.massage(req.body.email,new_password);
        mail_helper.Mail(req.body.email,mail_massage.subject,massage).then(() => {
            res.status(200).send({
                massage: 'success',
                info: 'your new password was sent to your email'
            });
        }).catch((error) => {
            console.log(error)
            res.status(500).send({
                massage: error.massage || "Internal Server Error"
            });
        });

    }
}