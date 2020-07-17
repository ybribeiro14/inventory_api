import Sequelize, { Model } from 'sequelize';

class Feature extends Model {
  static init(sequelize) {
    super.init(
      {
        client: Sequelize.STRING,
        stat: Sequelize.STRING,
        model: Sequelize.INTEGER,
        validate_ean: Sequelize.BOOLEAN,
        collect_serial: Sequelize.BOOLEAN,
        collect_date: Sequelize.BOOLEAN,
        collect_lot: Sequelize.BOOLEAN,
        empty_locator: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Feature;
