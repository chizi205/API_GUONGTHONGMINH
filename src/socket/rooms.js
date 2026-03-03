/**
 * Quy ước room:
 * - shop:<shop_id>
 * - kiosk:<kiosk_id>
 */
const joinShopRoom = (socket, shopId) => socket.join(`shop:${shopId}`);
const joinKioskRoom = (socket, kioskId) => socket.join(`kiosk:${kioskId}`);

module.exports = { joinShopRoom, joinKioskRoom };
