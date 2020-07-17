import * as Yup from 'yup';
import Feature from '../models/Feature';
import Count from '../models/Count';

class RegisterController {
  async registerCount(req, res) {
    const schema = Yup.object().shape({
      id_inventory: Yup.number().required(),
      locator: Yup.string().required(),
      ean: Yup.string(),
      amount: Yup.number(),
      user: Yup.string().required(),
      array_ean: Yup.array(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    try {
      const invetory = await Feature.findOne({
        where: { id: req.body.id_inventory },
      });

      if (!invetory) {
        return res
          .status(400)
          .json({ erro: 'Código de inventário informado não existe!' });
      }

      const { model, stat } = invetory;

      // *** Registro do modelo 01

      if (Number(model) === 1) {
        const counts = await Count.findOne({
          where: {
            locator: req.body.locator,
            first_ean: req.body.ean,
            id_feature: req.body.id_inventory,
          },
        });

        if (!counts) {
          const registerFirst = {
            id_feature: req.body.id_inventory,
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

      // *** Registro do modelo 03

      if (Number(model) === 3) {
        // receber um localizado e uma array de eans;
        // Fazer uma segragação com contagem para montar um array de objeto

        const { array_ean, locator, id_inventory, user } = req.body;

        const arrayInsert = [];

        if (Number(stat) === 1) {
          array_ean.map((eanPayload) => {
            const testFilter = arrayInsert.filter((eanList) => {
              return eanList.first_ean === eanPayload.ean;
            });

            if (testFilter.length === 0) {
              arrayInsert.push({
                id_feature: id_inventory,
                locator,
                first_ean: eanPayload.ean,
                first_amount: 1,
                first_user: user,
              });
            } else {
              let indexUpdate;
              arrayInsert.map((eanGet, index) => {
                if (eanGet.first_ean === eanPayload.ean) {
                  indexUpdate = index;
                }
              });
              arrayInsert[indexUpdate].first_amount =
                arrayInsert[indexUpdate].first_amount + 1;
            }
          });

          const registerCount = await Count.bulkCreate(arrayInsert);

          return res.json({
            arrayInsert,
            registerCount,
          });
        }

        if (Number(stat) === 2) {
          array_ean.map((eanPayload) => {
            const testFilter = arrayInsert.filter((eanList) => {
              return eanList.second_ean === eanPayload.ean;
            });

            if (testFilter.length === 0) {
              arrayInsert.push({
                id_feature: id_inventory,
                locator,
                second_ean: eanPayload.ean,
                second_amount: 1,
                second_user: user,
              });
            } else {
              let indexUpdate;
              arrayInsert.map((eanGet, index) => {
                if (eanGet.second_ean === eanPayload.ean) {
                  indexUpdate = index;
                }
              });
              arrayInsert[indexUpdate].second_amount =
                arrayInsert[indexUpdate].second_amount + 1;
            }
          });
          let secondCounts;
          arrayInsert.map(async (obj) => {
            secondCounts = await Count.findOne({
              where: {
                locator: req.body.locator,
                first_ean: obj.second_ean,
                id_feature: req.body.id_inventory,
              },
            });

            if (secondCounts) {
              await secondCounts.update(obj);
            } else {
              await Count.create(obj);
            }
          });

          return res.json({
            arrayInsert,
          });
        }

        if (Number(stat) === 3) {
          array_ean.map((eanPayload) => {
            const testFilter = arrayInsert.filter((eanList) => {
              return eanList.third_ean === eanPayload.ean;
            });

            if (testFilter.length === 0) {
              arrayInsert.push({
                id_feature: id_inventory,
                locator,
                third_ean: eanPayload.ean,
                third_amount: 1,
                third_user: user,
              });
            } else {
              let indexUpdate;
              arrayInsert.map((eanGet, index) => {
                if (eanGet.third_ean === eanPayload.ean) {
                  indexUpdate = index;
                }
              });
              arrayInsert[indexUpdate].third_amount =
                arrayInsert[indexUpdate].third_amount + 1;
            }
          });
          let thirdCounts;
          let checkWithSecondCount;
          arrayInsert.map(async (obj) => {
            thirdCounts = await Count.findOne({
              where: {
                locator: req.body.locator,
                first_ean: obj.third_ean,
                id_feature: req.body.id_inventory,
              },
            });

            if (thirdCounts) {
              await thirdCounts.update(obj);
            } else {
              checkWithSecondCount = await Count.findOne({
                where: {
                  locator: req.body.locator,
                  second_ean: obj.third_ean,
                  id_feature: req.body.id_inventory,
                },
              });

              if (checkWithSecondCount) {
                await checkWithSecondCount.update(obj);
              } else {
                await Count.create(obj);
              }
            }
          });

          return res.json({
            arrayInsert,
          });
        }

        if (Number(stat) === 4) {
          array_ean.map((eanPayload) => {
            const testFilter = arrayInsert.filter((eanList) => {
              return eanList.fourth_ean === eanPayload.ean;
            });

            if (testFilter.length === 0) {
              arrayInsert.push({
                id_feature: id_inventory,
                locator,
                fourth_ean: eanPayload.ean,
                fourth_amount: 1,
                fourth_user: user,
              });
            } else {
              let indexUpdate;
              arrayInsert.map((eanGet, index) => {
                if (eanGet.fourth_ean === eanPayload.ean) {
                  indexUpdate = index;
                }
              });
              arrayInsert[indexUpdate].fourth_amount =
                arrayInsert[indexUpdate].fourth_amount + 1;
            }
          });
          let fourthCounts;
          let checkWithSecondCount;
          let checkWithThirdCount;
          arrayInsert.map(async (obj) => {
            fourthCounts = await Count.findOne({
              where: {
                locator: req.body.locator,
                first_ean: obj.fourth_ean,
                id_feature: req.body.id_inventory,
              },
            });

            if (fourthCounts) {
              await fourthCounts.update(obj);
            } else {
              checkWithSecondCount = await Count.findOne({
                where: {
                  locator: req.body.locator,
                  second_ean: obj.fourth_ean,
                  id_feature: req.body.id_inventory,
                },
              });

              if (checkWithSecondCount) {
                await checkWithSecondCount.update(obj);
              } else {
                checkWithThirdCount = await Count.findOne({
                  where: {
                    locator: req.body.locator,
                    third_ean: obj.fourth_ean,
                    id_feature: req.body.id_inventory,
                  },
                });

                if (checkWithThirdCount) {
                  await checkWithThirdCount.update(obj);
                } else {
                  await Count.create(obj);
                }
              }
            }
          });

          return res.json({
            arrayInsert,
          });
        }
      }

      // *** Fim do registro do modelo 03

      if (Number(stat) === 1) {
        // Registro primeira contagem modelo 02
        const registerFirst = {
          id_feature: req.body.id_inventory,
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
          id_feature: req.body.id_inventory,
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
          id_feature: req.body.id_inventory,
        },
      });

      if (secondCounts && Number(stat) === 3) {
        const registerThird = {
          id_feature: req.body.id_inventory,
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
          id_feature: req.body.id_inventory,
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
        id_feature: req.body.id_inventory,
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
    } catch (error) {
      return res.status(400).json({ erro: `Erro: ${error}` });
    }
  }
}

export default new RegisterController();
