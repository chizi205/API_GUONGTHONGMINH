const db = require("../../config/database");

const findKioskAccountByUsername = async (username) => {
  const { rows } = await db.query(
    `SELECT
       ka.id AS kiosk_account_id,
       ka.shop_id,
       ka.kiosk_id,
       ka.username,
       ka.password_hash,
       ka.is_active,
       k.status AS kiosk_status,
       s.status AS shop_status,
       k.name AS kiosk_name,
       k.location AS kiosk_location
     FROM kiosk_accounts ka
     JOIN kiosks k ON k.id = ka.kiosk_id
     JOIN shops s ON s.id = ka.shop_id
     WHERE ka.username = $1
     LIMIT 1`,
    [username],
  );
  return rows[0] || null;
};

const updateKioskLastLogin = async (kioskAccountId) => {
  await db.query(
    `UPDATE kiosk_accounts SET last_login = NOW(), updated_at = NOW() WHERE id = $1`,
    [kioskAccountId],
  );
};

const updateKioskLastActive = async (kioskId) => {
  await db.query(
    `UPDATE kiosks SET last_active = NOW(), updated_at = NOW() WHERE id = $1`,
    [kioskId],
  );
};
const setRefreshToken = async (kioskAccountId, refreshTokenHash, expiry) => {
  await db.query(
    `UPDATE kiosk_accounts
     SET refresh_token_hash = $2,
         refresh_token_expiry = $3,
         updated_at = NOW()
     WHERE id = $1`,
    [kioskAccountId, refreshTokenHash, expiry],
  );
};

const findKioskAccountById = async (kioskAccountId) => {
  const { rows } = await db.query(
    `SELECT
       ka.id AS kiosk_account_id,
       ka.shop_id,
       ka.kiosk_id,
       ka.is_active,
       ka.refresh_token_hash,
       ka.refresh_token_expiry,
       k.status AS kiosk_status,
       s.status AS shop_status
     FROM kiosk_accounts ka
     JOIN kiosks k ON k.id = ka.kiosk_id
     JOIN shops s ON s.id = ka.shop_id
     WHERE ka.id = $1
     LIMIT 1`,
    [kioskAccountId],
  );
  return rows[0] || null;
};
const clearRefreshToken = async (kioskAccountId) => {
  await db.query(
    `UPDATE kiosk_accounts
     SET refresh_token_hash = NULL,
         refresh_token_expiry = NULL,
         updated_at = NOW()
     WHERE id = $1`,
    [kioskAccountId]
  );
};

module.exports = {
  findKioskAccountByUsername,
  updateKioskLastLogin,
  updateKioskLastActive,
  setRefreshToken,
  findKioskAccountById,
  clearRefreshToken
};
