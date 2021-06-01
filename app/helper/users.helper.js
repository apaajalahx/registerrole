exports.update = (users, req) => {
    users.findOne({where: {id: req.params.id}, include: ['role']}).then((data) => {
        if(req.body.type == 'info'){
            data.name = req.body.name;
            data.email = req.body.email;
            data.phone = req.body.phone;
            data.role.name = req.body.role;
            data.save();
        } else if(req.body.type == 'password'){
            data.password = bcryp.hashSync(req.body.password);
            data.save();
        } else {
            res.status(500).send({
                massage: "you not have permission"
            });
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send({
            massage: error.massage || "Internal Server Error"
        });
    });
}