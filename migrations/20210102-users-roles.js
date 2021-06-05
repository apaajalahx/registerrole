'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      
      await queryInterface.addColumn('users','roleId', {
       type: Sequelize.INTEGER,
       references: {
         model: 'roles',
         key: 'id'
       },
       after: 'password',
       onUpdate: 'CASCADE',
       onDelete: 'SET NULL'
     });
     await queryInterface.addColumn('users','rolesid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id'
      },
      after: 'roleId',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('users','rolesid');
  }
};
