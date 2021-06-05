module.exports = (sequelize,Sequelize) => {
    const Roles = sequelize.define("roles",{
            name: { 
                type: Sequelize.STRING
            }
        }
    );
    return Roles;
}