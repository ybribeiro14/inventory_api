import Sequelize, { Model } from 'sequelize';

class Count extends Model {
  static init(sequelize) {
    super.init(
      {
        id_inventory: Sequelize.INTEGER,
        locator: Sequelize.STRING,
        first_ean: Sequelize.STRING(14),
        first_lot: Sequelize.STRING,
        first_serial: Sequelize.STRING,
        first_date_validate: Sequelize.DATE,
        first_amount: Sequelize.DOUBLE,
        first_user: Sequelize.STRING,
        second_ean: Sequelize.STRING(14),
        second_lot: Sequelize.STRING,
        second_serial: Sequelize.STRING,
        second_date_validate: Sequelize.DATE,
        second_amount: Sequelize.DOUBLE,
        second_user: Sequelize.STRING,
        third_ean: Sequelize.STRING(14),
        third_lot: Sequelize.STRING,
        third_serial: Sequelize.STRING,
        third_date_validate: Sequelize.DATE,
        third_amount: Sequelize.DOUBLE,
        third_user: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Count;
