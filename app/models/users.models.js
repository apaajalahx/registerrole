module.exports = (sequelize,Sequelize) => {
    const Users = sequelize.define("users",{
            name: { 
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.BIGINT
            },
            password: {
                type: Sequelize.STRING
            }, 
            status: {
                type: Sequelize.ENUM,
                values: ['active','pending','banned'],
                defaultValue: 'pending'
            },
            rolesid: {
                type: Sequelize.INTEGER,
                references : {
                    model: 'roles',
                    key: 'id'
                }
            }
        }
    );
    return Users;
}