const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
data.roles = require('./roles.models')(sequelize,Sequelize);
data.roles.hasMany(data.users, { as: "users"});
data.users.belongsTo(data.roles, {
    foreignKey: "roleId",
    as: 'role'
});

module.exports = data;