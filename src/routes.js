import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RegisterController from './app/controllers/RegisterController';
import ValidationController from './app/controllers/ValidationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/check_ean', ValidationController.store);
routes.post('/check_locator', ValidationController.index);

routes.post('/register', RegisterController.store);

export default routes;
