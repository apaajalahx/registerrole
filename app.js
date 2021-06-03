const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

port = process.env.PORT || 8080

var Corsopt = {
    origin: 'http://localhost:'+port
}

app.use(cors(Corsopt));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require('./app/models/index');

db.sequelize.sync({force:false}).then(()=>{
    console.log("drop and re-sync db");
});

app.get('/', (req, res) => {
    res.send('hello words');
});

const Apps = require('./app/routes/routes');

app.use('/api/v1',Apps);

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});