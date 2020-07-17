import * as Yup from 'yup';

import Base from '../models/Base';
import Feature from '../models/Feature';

class BaseController {
  async createEmptyLocator(req, res) {
    const schema = Yup.object().shape({
      locator: Yup.string().required(),
      id_feature: Yup.number().required(),
      amount: Yup.number().required(),
      address: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { id_feature } = req.body;

    const inventoryData = await Feature.findOne({
      where: { id: id_feature },
    });
    if (!inventoryData) {
      return res.json({
        error: 'Código de Inventário informado não existe!',
        statusCode: 400,
      });
    }
    const { id } = await Base.create(req.body);

    return res.json({
      user: {
        id,
      },
    });
  }
}

export default new BaseController();
