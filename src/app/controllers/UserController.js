import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async createUser(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      job: Yup.string().required(),
      login: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { login: req.body.login } });

    if (userExists) {
      return res.status(400).json({ erro: 'User already exists' });
    }

    const { id, name, login, job } = await User.create(req.body);

    return res.json({
      id,
      name,
      login,
      job,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().email().required(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Unregistered email.' });
    }

    if (!(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async getUsers(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }
}

export default new UserController();
