const bcryp = require('bcryptjs');
const { users,roles } = require('../models/index');
const mail_helper = require('../helper/mail.helper');
const jwt_helper = require('../helper/jwt.helper');
const mail_massage = require('../../resource/mail/mail');
const users_helper = require('../helper/users.helper');
exports.Register = (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcryp.hashSync(req.body.password),
        roleId: 2 // default member
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
            if(data.status=='pending'){
                mail_massage.email = data.email;
                mail_massage.subject = 'Please Actived Your Account';
                mail_massage.activation = users_helper.url + "/api/v1/verify/" + users_helper.create_activation(data.id, data.password);
                mail_massage.letter = 'activation.html';
                massage = mail_massage.massage();
                mail_helper.Mail(req.body.email,mail_massage.subject,massage).then(() => {
                    res.status(200).send({
                        massage: 'success',
                        info: 'your activated url has been sent to your email'
                    });
                }).catch((error) => {
                    console.log(error)
                    res.status(500).send({
                        massage: error.massage || "Internal Server Error"
                    });
                });
            } else if(data.status=='banned') {
                res.status(500).send({
                    massage: 'your account has been banned'
                });
            } else if(data.status=='active') {
                let req_token = {
                    id: data.id,
                    email: data.email,
                    role: data.role.name
                    }
                let token = jwt_helper.SJwt(req_token);
                console.log(token);
                res.status(200).send({
                    massage: "success login",
                    auth: data.email,
                    role: data.role.name,
                    token
                });
            }
        } else {
            res.status(500).send({
                massage: "failed login, wrong password"
            });
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send({
            massage: "failed login, username and password not match"
        });
    });
}
exports.RefreshToken = (req, res) => {
    const new_token = jwt_helper.Refresh(req.body.refreshtoken);
    console.log(new_token);
    if(new_token==false){
        res.status(500).send({
            massage: "Error, Token not found"
        });
    } else {
        res.status(200).send({
            massage: 'success',
            token: new_token,
            expires: '20 minute'
        })
    }
}
exports.VerifyEmail = (req, res) => {
    let data = users_helper.verify_activation(req.params.verify);
    if(!data){
        res.status(500).send({
            massage: 'error, invalid token'
        });
    } else {
        users.findOne({
            where: {
                id: data.id,
                password: data.password
            }
        }).then((result) => {
            result.status = 'active';
            result.save();
            res.status(200).send({
                massage: 'your email success verifed.'
            });
        }).catch((error) => {
            res.status(500).send({
                massage: error || "Internal Server Error"
            })
        })
    }
}

exports.Index = (req, res) => {
    const { id } = jwt_helper.DJwt(req);
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

exports.Update = (req, res) => {
    const { role,id } = jwt_helper.DJwt(req);
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
            users_helper.update(req, id, res);
    }
}

exports.DeleteFind = (req, res) => {
    const { role } = jwt_helper.DJwt(req);
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
        mail_massage.email = req.body.email;
        mail_massage.subject = "Request Reset Password";
        mail_massage.password = new_password;
        mail_massage.letter = 'mail.html';
        massage = mail_massage.massage();
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

exports.Logout = (req, res) => {
    if(jwt_helper.BJwt(req.body.refreshtoken)){
        res.status(200).send({
            massage: 'Success Logout!'
        });
    }
}