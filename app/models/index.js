const dbconf = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbconf.DB,dbconf.USER,dbconf.PASSWORD,{
    host: dbconf.HOST,
    dialect: dbconf.dialect,
    operatorAliases: false,
    pool: {
        max: dbconf.pool.max,
        min: dbconf.pool.min,
        acquire: dbconf.pool.acquire,
        idle: dbconf.pool.idle
    }
});
/** 
 * 
 * check if connection and authenticate to database success.
 * 
try{
    sequelize.authenticate();
    console.log("connection success");
} catch (error) {
    console.log("connection failed : " + error);
}*/
const data = {}
data.sequelize = sequelize;
data.Sequelize = Sequelize;
data.users = require('./users.models')(sequelize,Sequelize);
data.roles = require('./role.models')(sequelize,Sequelize);
data.roles.hasMany(data.users, { as: "users"});
data.users.belongsTo(data.roles, {
    foreignKey: "rolesid",
    as:"role"
});

module.exports = data;