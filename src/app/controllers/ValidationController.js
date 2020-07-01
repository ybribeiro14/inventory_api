/* eslint-disable camelcase */
import * as Yup from 'yup';

import Product from '../models/Product';
import Base from '../models/Base';
import Count from '../models/Count';
import Feature from '../models/Feature';

class ValidationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      ean: Yup.string().required().min(13),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({
        error: 'Esperado no mínimo 13 dígitos.',
        statusCode: 400,
      });
    }

    const dataEan = await Product.findOne({ where: { ean: req.body.ean } });

    if (!dataEan) {
      return res.json({
        error: 'EAN informado não está cadastrado.',
        statusCode: 400,
      });
    }

    const { cod_product, description } = dataEan;

    return res.json({ cod_product, description, statusCode: 200 });
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      idInventory: Yup.number().required(),
      locator: Yup.string().required(),
      user: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails', statusCode: 400 });
    }

    const locator = await Base.findOne({
      where: { locator: req.body.locator, id_feature: req.body.idInventory },
    });

    if (!locator) {
      return res.json({
        error: 'Localizador não encontrado.',
        statusCode: 400,
      });
    }

    const inventoryData = await Feature.findOne({
      where: { id: req.body.idInventory },
    });

    const { model, stat } = inventoryData;

    // Validando os dados de inventário modelo 2
    if (stat === 'F1' || stat === 'F2') {
      return res.json({
        error: 'Próxima contagem ainda não foi liberada para este endereço!',
        statusCode: 400,
      });
    }
    if (stat === 'F3') {
      return res.json({
        error: 'Contagens deste inventário já estão encerradas!',
        statusCode: 400,
      });
    }

    const counts = await Count.findAll({
      where: {
        locator: req.body.locator,
        id_feature: req.body.idInventory,
      },
    });

    const { ean, amount } = locator;

    if (model === 1) {
      if (counts.length === 0) {
        return res.json({ count: 'Primeira contagem', statusCode: 200 });
      }
      const objCounts = counts[0];

      const {
        first_ean,
        first_amount,
        first_user,
        second_ean,
        second_amount,
        second_user,
        third_user,
      } = objCounts;

      // Validar se primeria contagem já bateu com o estoque
      if (first_ean === ean && Number(first_amount) === Number(amount)) {
        return res.json({
          error: 'Produto já validado pela primeira contagem',
          statusCode: 400,
        });
      }

      // Validar se segunda contagem já bateu com o estoque ou com a primeira
      if (
        (second_ean === ean && Number(second_amount) === Number(amount)) ||
        (second_ean === first_ean &&
          Number(second_amount) === Number(first_amount))
      ) {
        return res.json({
          error: 'Produto já validado pela segunda contagem',
          statusCode: 400,
        });
      }

      // Validar se o usuário está autorizado a fazer a próxima contagem

      if (req.body.user === first_user || req.body.user === second_user) {
        return res.json({
          error: 'Usuário não tem permissão para fazer esta contagem!',
          statusCode: 400,
        });
      }

      if (third_user) {
        return res.json({
          error: 'Todas as contagens já realizadas para esse Localizador.',
          statusCode: 400,
        });
      }

      return res.json({ statusCode: 200 });
    }

    const arrayEans = [];
    const arrayUsers = [];

    arrayUsers.push(
      counts[0].first_user,
      counts[0].second_user,
      counts[0].third_user
    );

    if (Number(stat) === 1) {
      counts.map((count) => arrayEans.push(count.first_ean));
    }
    if (Number(stat) === 2) {
      counts.map((count) => arrayEans.push(count.second_ean));
    }
    if (Number(stat) === 3) {
      counts.map((count) => arrayEans.push(count.third_ean));
    }

    return res.json({
      countNumber: Number(stat),
      eans: arrayEans,
      users: arrayUsers,
      statusCode: 200,
    });
  }
}

export default new ValidationController();
