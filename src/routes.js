import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RegisterController from './app/controllers/RegisterController';
import ValidationController from './app/controllers/ValidationController';
import BaseController from './app/controllers/BaseController';
import FeatureController from './app/controllers/FeatureController';
import CountController from './app/controllers/CountController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.createUser);
routes.get('/users', UserController.getUsers);
routes.post('/sessions', SessionController.newSession);

routes.use(authMiddleware);

routes.post('/vinc_user_feature', UserController.vincUserFeature);

routes.post('/check_ean', ValidationController.checkEan);
routes.post('/check_ean_locator', ValidationController.checkEanLocator);
routes.post('/check_locator', ValidationController.checkLocator);
routes.post('/empty_locator', BaseController.createEmptyLocator);

routes.post('/register', RegisterController.registerCount);

routes.get('/stat_feature/:id_feature', FeatureController.getStatFeature);
routes.get('/get_features', FeatureController.getFeatures);
routes.post('/change_stat', FeatureController.changeStatFeature);

routes.get('/stat_counts/:id_feature', CountController.getCounts);

export default routes;
