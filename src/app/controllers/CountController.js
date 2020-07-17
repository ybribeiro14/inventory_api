import * as Yup from 'yup';

import Count from '../models/Count';

class CountController {
  async getCounts(req, res) {
    const schema = Yup.object().shape({
      id_feature: Yup.number().required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { id_feature } = req.params;
    console.log(id_feature);

    const listCounts = await Count.findAll({
      where: { id_feature },
    });
    if (!listCounts) {
      return res.json({
        error: 'Não há contagens para este inventário!',
        statusCode: 400,
      });
    }

    return res.json({
      listCounts,
    });
  }
}

export default new CountController();
