const repo = require("../../repositories/kiosk/catalog.repo");

const getMyCategories = async (kioskId) => {
  const categories = await repo.listKioskCategories(kioskId);
  const defaultCategory = categories.find((c) => c.is_default) || null;
  return { categories, default_category_id: defaultCategory ? defaultCategory.id : null };
};

const getProductsByCategory = async ({ kioskId, shopId, categoryId }) => {
  if (!categoryId) {
    const err = new Error("MISSING_CATEGORY_ID");
    err.status = 400;
    throw err;
  }

  const allowed = await repo.kioskHasCategory(kioskId, categoryId);
  if (!allowed) {
    const err = new Error("CATEGORY_NOT_ALLOWED_FOR_KIOSK");
    err.status = 403;
    throw err;
  }

  const rows = await repo.listProductsByCategory(shopId, categoryId);

  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.product_id)) {
      map.set(r.product_id, {
        id: r.product_id,
        name: r.product_name,
        description: r.description,
        variants: [],
      });
    }
    if (r.variant_id) {
      map.get(r.product_id).variants.push({
        id: r.variant_id,
        sku: r.sku,
        size: r.size,
        color: r.color,
        price: r.price,
        stock: r.stock,
        model_3d_url: r.model_3d_url,
        image_urls: r.image_urls,
      });
    }
    console.log(map.values());
  }
  return Array.from(map.values());
};

module.exports = { getMyCategories, getProductsByCategory };
