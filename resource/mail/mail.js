const fs = require('fs');
const mail = {};
// here your subject
let dir = __dirname;
mail.subject = "Change password request.";
mail.massage = (email, password) => {
    data = fs.readFileSync(dir + "/mail.html", 'utf-8').toString();
    data = data.replace('{subject}',mail.subject);
    data = data.replace('{email}', email);
    data = data.replace('{password}', password);
    return data;
}

module.exports = mail;
