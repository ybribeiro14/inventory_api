import * as Yup from 'yup';
import Feature from '../models/Feature';
import Count from '../models/Count';

class RegisterController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id_inventory: Yup.number().required(),
      locator: Yup.string().required(),
      ean: Yup.string().required(),
      amount: Yup.number().required(),
      user: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const invetory = await Feature.findOne({
      where: { id: req.body.id_inventory },
    });

    if (!invetory) {
      return res.status(400).json({ erro: 'Inventory ID does not exist' });
    }

    const { model, stat } = invetory;

    // *** Registro do modelo 01

    if (Number(model) === 1) {
      const counts = await Count.findOne({
        where: {
          locator: req.body.locator,
          ean: req.body.ean,
          id_inventory: req.body.id_inventory,
        },
      });
      if (!counts) {
        const registerFirst = {
          id_inventory: req.body.id_inventory,
          locator: req.body.locator,
          first_ean: req.body.ean,
          first_lot: req.body.lot ? req.body.lot : null,
          first_serial: req.body.serial ? req.body.serial : null,
          first_date_validate: req.body.date_validate
            ? req.body.date_validate
            : null,
          first_amount: req.body.amount,
          first_user: req.body.user,
        };

        const { id, locator } = await Count.create(registerFirst);

        return res.json({
          id,
          locator,
        });
      }
      if (!counts.second_amount) {
        const registerSecond = {
          second_ean: req.body.ean,
          second_lot: req.body.lot ? req.body.lot : null,
          second_serial: req.body.serial ? req.body.serial : null,
          second_date_validate: req.body.date_validate
            ? req.body.date_validate
            : null,
          second_amount: req.body.amount,
          second_user: req.body.user,
        };

        const { id, locator } = await counts.update(registerSecond);

        return res.json({
          id,
          locator,
        });
      }
      const registerThird = {
        third_ean: req.body.ean,
        third_lot: req.body.lot ? req.body.lot : null,
        third_serial: req.body.serial ? req.body.serial : null,
        third_date_validate: req.body.date_validate
          ? req.body.date_validate
          : null,
        third_amount: req.body.amount,
        third_user: req.body.user,
      };

      const { id, locator } = await counts.update(registerThird);

      return res.json({
        id,
        locator,
      });
    }

    // *** Fim do registro do modelo 01

    if (Number(stat) === 1) {
      // Registro primeira contagem modelo 02
      const registerFirst = {
        id_inventory: req.body.id_inventory,
        locator: req.body.locator,
        first_ean: req.body.ean,
        first_lot: req.body.lot ? req.body.lot : null,
        first_serial: req.body.serial ? req.body.serial : null,
        first_date_validate: req.body.date_validate
          ? req.body.date_validate
          : null,
        first_amount: req.body.amount,
        first_user: req.body.user,
      };

      const { id, locator } = await Count.create(registerFirst);

      return res.json({
        id,
        locator,
      });
    }

    const counts = await Count.findOne({
      where: {
        locator: req.body.locator,
        first_ean: req.body.ean,
        id_inventory: req.body.id_inventory,
      },
    });

    if (counts) {
      // Registro segunda e terceira contagem quando a primeira foi feita
      if (Number(stat) === 2) {
        const registerSecond = {
          second_ean: req.body.ean,
          second_lot: req.body.lot ? req.body.lot : null,
          second_serial: req.body.serial ? req.body.serial : null,
          second_date_validate: req.body.date_validate
            ? req.body.date_validate
            : null,
          second_amount: req.body.amount,
          second_user: req.body.user,
        };

        const { id, locator } = await counts.update(registerSecond);

        return res.json({
          id,
          locator,
        });
      }

      const registerThird = {
        third_ean: req.body.ean,
        third_lot: req.body.lot ? req.body.lot : null,
        third_serial: req.body.serial ? req.body.serial : null,
        third_date_validate: req.body.date_validate
          ? req.body.date_validate
          : null,
        third_amount: req.body.amount,
        third_user: req.body.user,
      };

      const { id, locator } = await counts.update(registerThird);

      return res.json({
        id,
        locator,
      });
    }

    // ***

    // Registro de terceira contagem quando somente a segunda foi feita
    const secondCounts = await Count.findOne({
      where: {
        locator: req.body.locator,
        second_ean: req.body.ean,
        id_inventory: req.body.id_inventory,
      },
    });

    if (secondCounts && Number(stat) === 3) {
      const registerThird = {
        id_inventory: req.body.id_inventory,
        locator: req.body.locator,
        third_ean: req.body.ean,
        third_lot: req.body.lot ? req.body.lot : null,
        third_serial: req.body.serial ? req.body.serial : null,
        third_date_validate: req.body.date_validate
          ? req.body.date_validate
          : null,
        third_amount: req.body.amount,
        third_user: req.body.user,
      };

      const { id, locator } = await secondCounts.update(registerThird);

      return res.json({
        id,
        locator,
      });
    }

    if (Number(stat) === 2) {
      const registerSecond = {
        id_inventory: req.body.id_inventory,
        locator: req.body.locator,
        second_ean: req.body.ean,
        second_lot: req.body.lot ? req.body.lot : null,
        second_serial: req.body.serial ? req.body.serial : null,
        second_date_validate: req.body.date_validate
          ? req.body.date_validate
          : null,
        second_amount: req.body.amount,
        second_user: req.body.user,
      };

      const { id, locator } = await Count.create(registerSecond);

      return res.json({
        id,
        locator,
      });
    }

    const registerThird = {
      id_inventory: req.body.id_inventory,
      locator: req.body.locator,
      third_ean: req.body.ean,
      third_lot: req.body.lot ? req.body.lot : null,
      third_serial: req.body.serial ? req.body.serial : null,
      third_date_validate: req.body.date_validate
        ? req.body.date_validate
        : null,
      third_amount: req.body.amount,
      third_user: req.body.user,
    };

    const { id, locator } = await Count.create(registerThird);

    return res.json({
      id,
      locator,
    });
  }
}

export default new RegisterController();
