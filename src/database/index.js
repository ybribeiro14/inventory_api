import Sequelize from 'sequelize';

import User from '../app/models/User';
import Base from '../app/models/Base';
import Count from '../app/models/Count';
import Feature from '../app/models/Feature';
import Product from '../app/models/Product';

import databaseConfig from '../config/database';

const models = [User, Base, Count, Feature, Product]; // Array com todos os models da aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    // .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
