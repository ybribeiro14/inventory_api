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

  async getFeatures(req, res) {
    const features = await Feature.findAll();

    return res.json(features);
  }

  async changeStatFeature(req, res) {
    const schema = Yup.object().shape({
      id_feature: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { id_feature } = req.body;

    const feature = await Feature.findOne({
      where: { id: id_feature },
    });
    if (!feature) {
      return res.json({
        error: 'Código de Inventário informado não existe!',
        statusCode: 400,
      });
    }

    const newStat = Number(feature.stat) + 1;

    const result = await feature.update({
      stat: newStat,
    });

    return res.json({
      result,
      statusCode: 200,
    });
  }
}

export default new FeatureController();
