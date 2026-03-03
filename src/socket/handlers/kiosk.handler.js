const EVENTS = require("../events");

module.exports = function kioskHandler(io, socket) {
  // Ví dụ: kiosk app emit "kiosk:ping" định kỳ
  socket.on(EVENTS.KIOSK_PING, (payload) => {
    // TODO: update kiosks.last_active ở DB (qua service/repo)
    // io.to(`shop:${payload.shop_id}`).emit(...)
  });
};
