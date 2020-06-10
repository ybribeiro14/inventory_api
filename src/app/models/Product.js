import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        ean: Sequelize.STRING(14),
        cod_product: Sequelize.STRING,
        description: Sequelize.STRING,
        id_feature: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Product;
