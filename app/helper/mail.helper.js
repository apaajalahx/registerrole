const Nmail = require('nodemailer');
const config = require('../config/smtp.config');

exports.Mail = (to, subject, massage) => {
    var secure = false;
    if(config.port==465){
        secure = true;
    }
    let sender = Nmail.createTransport({
        host: config.host,
        port: config.port,
        secure: secure,
        auth: {
            user: config.user,
            pass: config.pass
        },
    });
    return sender.sendMail({
        from: `${config.name} <${config.from}>`,
        to: to,
        subject: subject,
        html: massage
    }).then((data) => {
        return true;
    }).catch((error) => {
        console.log(error);
        return false;
    });
}