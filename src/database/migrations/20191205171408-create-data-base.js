module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bases', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_inventory: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      locator: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ean: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      product: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      area: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      block: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      street: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      building: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      floor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      side: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false,
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

  down: queryInterface => {
    return queryInterface.dropTable('bases');
  },
};
