import * as Yup from 'yup';

import Feature from '../models/Feature';

class FeatureController {
  async getStatFeature(req, res) {
    const schema = Yup.object().shape({
      id_feature: Yup.number().required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { id_feature } = req.params;

    const { stat } = await Feature.findOne({
      where: { id: id_feature },
    });
    if (!stat) {
      return res.json({
        error: 'Código de Inventário informado não existe!',
        statusCode: 400,
      });
    }

    return res.json({
      stat,
    });
  }
}

export default new FeatureController();
