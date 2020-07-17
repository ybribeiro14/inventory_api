import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';
import Feature from '../models/Feature';

class SessionController {
  async newSession(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { login, password } = req.body;

    const user = await User.findOne({ where: { login } });
    // Quando a tag e variável são iguais pode por desta froma

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not watch' });
    }

    const { id, name, job, id_feature } = user;

    const feature = await Feature.findOne({ where: { id: id_feature } });

    return res.json({
      user: {
        id,
        name,
        login,
        job,
        id_feature,
        feature,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
