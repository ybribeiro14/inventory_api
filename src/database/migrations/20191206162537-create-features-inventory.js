module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('features', {
      id_feature: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      client: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      validate_ean: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      collect_serial: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      collect_lot: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      collect_date: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      stat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('features');
  },
};
