module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('counts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_feature: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      locator: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_ean: {
        type: Sequelize.STRING(14),
        allowNull: true,
      },
      first_lot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_serial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_date_validate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      first_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      first_user: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_ean: {
        type: Sequelize.STRING(14),
        allowNull: true,
      },
      second_lot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_serial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      second_date_validate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      second_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      second_user: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      third_ean: {
        type: Sequelize.STRING(14),
        allowNull: true,
      },
      third_lot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      third_serial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      third_date_validate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      third_amount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      third_user: {
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
    return queryInterface.dropTable('counts');
  },
};
