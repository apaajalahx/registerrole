const { roles } = require('../models/index');
const jwt_helper = require('../helper/jwt.helper');

exports.Create = (req, res) => {
    const {role} = jwt_helper.DJwt(req);
    if(role=='admin'){
        const rname = {
            name: req.body.name,
        }
        roles.create(rname).then((data) => {
            res.status(200).send({
                massage: 'success add roles',
                data
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).send({
                massage: error.massage || 'Internal Server Error'
            })
        });
    } else {
        res.status(500).send({
            massage: 'you not have permission'
        })
    }
}

exports.Update = (req, res) => {
    const {role} = jwt_helper.DJwt(req);
    if(role=='admin'){
        if(!req.params.id){
            res.status(500).send({
                massage: 'params id required'
            });
        }
        if(!req.body.name){
            res.status(500).send({
                massage: 'body name required'
            });
        }
        roles.findOne({where: {id: req.params.id}}).then((data) => {
            data.name = req.body.name;
            data.save();
            res.status(200).send({
                massage: `success update roles id ${req.params.id}`
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).send({
                massage: error.massage || 'Internal Server Error'
            })
        });
    } else {
        res.status(500).send({
            massage: 'you not have permission'
        });
    }
}

exports.Delete = (req, res) => {
    const {role} = jwt_helper.DJwt(req);
    if(role=='admin'){
        if(!req.params.id){
            res.status(500).send({
                massage: 'params id required'
            });
        }
        roles.destroy({
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
            massage: 'you not have permission'
        });
    }
}