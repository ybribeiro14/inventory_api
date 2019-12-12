/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import routes from './routes';
import './database';

const path = require('path');

/* dentro de app por padrão trabalhamos com classes, pois podemos chamar estas classes de toda
a aplicação */

class App {
  /* Dentro da classe há um método chamado contructor que é executado automaticamente quando a
  classe é instanciada. */

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  // eslint-disable-next-line linebreak-style
  middlewares() {
    // Configura o servidor para ler requisões que retornam arquivos json.
    this.server.use(cors());
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.use(express.json());
  }

  routes() {
    // usa o arquivo routes.js que também são middlewares para ler todas as rotas.
    this.server.use(routes);
  }
}

export default new App().server; // Exporta o servidor criado com o express
