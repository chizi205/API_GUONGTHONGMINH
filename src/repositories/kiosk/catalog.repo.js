const db = require("../../config/database");


const listKioskCategories = async (kioskId) => {
  const { rows } = await db.query(
    `SELECT
       pc.id,
       pc.name,
       pc.slug,
       kc.is_default,
       kc.sort_order
     FROM kiosk_categories kc
     JOIN product_categories pc ON pc.id = kc.category_id
     WHERE kc.kiosk_id = $1
       AND pc.is_active = TRUE
     ORDER BY kc.sort_order ASC, pc.name ASC`,
    [kioskId]
  );
  return rows;
};

const kioskHasCategory = async (kioskId, categoryId) => {
  const { rows } = await db.query(
    `SELECT 1 FROM kiosk_categories WHERE kiosk_id = $1 AND category_id = $2 LIMIT 1`,
    [kioskId, categoryId]
  );
  return rows.length > 0;
};

const listProductsByCategory = async (shopId, categoryId) => {
  const { rows } = await db.query(
    `SELECT
       p.id AS product_id,
       p.name AS product_name,
       p.description,
       p.status,
       v.id AS variant_id,
       v.sku,
       v.size,
       v.color,
       v.price,
       v.stock,
       v.model_3d_url,
       v.image_urls
     FROM products p
     LEFT JOIN product_variants v ON v.product_id = p.id
     WHERE p.shop_id = $1
       AND p.category_id = $2
       AND p.status = 'active'
       AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC, v.created_at ASC`,
    [shopId, categoryId]
  );
  return rows;
};

module.exports = {
  listKioskCategories,
  kioskHasCategory,
  listProductsByCategory,
};
