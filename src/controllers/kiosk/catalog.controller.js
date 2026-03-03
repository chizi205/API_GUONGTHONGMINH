const service = require("../../services/kiosk/catalog.service");
const { ok, serverError } = require("../../utils/response");

const myCategories = async (req, res) => {
  try {
    const { kiosk_id } = req.kiosk;
    const data = await service.getMyCategories(kiosk_id);
    return ok(res, 200, data);
  } catch (err) {
    console.log(err);
    return serverError(res);
  }
};

const productsByCategory = async (req, res) => {
  try {
    const { kiosk_id, shop_id } = req.kiosk;
    const category_id = req.query.category_id;
    const data = await service.getProductsByCategory({
      kioskId: kiosk_id,
      shopId: shop_id,
      categoryId: category_id,
    });
    return ok(res, 200, data);
  } catch (err) {
    console.log(err);
    return serverError(res);
  }
};

module.exports = { myCategories, productsByCategory };
