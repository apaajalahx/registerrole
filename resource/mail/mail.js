const fs = require('fs');
let mail = {};
// here your subject
let dir = __dirname;
mail.subject = "";
mail.password = "";
mail.email = "";
mail.activation = "";
mail.letter = "" || "mail.html";
mail.massage = () => {
    data = fs.readFileSync(dir + "/" + mail.letter, 'utf-8').toString();
    data = data.replace('{subject}',mail.subject);
    data = data.replace('{email}', mail.email);
    data = data.replace('{activation}', mail.activation)
    data = data.replace('{password}', mail.password);
    return data;
}

module.exports = mail;
