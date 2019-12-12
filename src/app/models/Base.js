import Sequelize, { Model } from 'sequelize';

class Base extends Model {
  static init(sequelize) {
    super.init(
      {
        id_inventory: Sequelize.INTEGER,
        locator: Sequelize.STRING,
        ean: Sequelize.STRING(14),
        product: Sequelize.STRING,
        description: Sequelize.STRING,
        area: Sequelize.STRING,
        address: Sequelize.STRING,
        block: Sequelize.STRING,
        street: Sequelize.DOUBLE,
        building: Sequelize.STRING,
        floor: Sequelize.STRING,
        side: Sequelize.STRING,
        amount: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Base;
