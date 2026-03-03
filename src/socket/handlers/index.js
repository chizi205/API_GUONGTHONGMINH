const kioskHandler = require("./kiosk.handler");
const shopHandler = require("./shop.handler");
const adminHandler = require("./admin.handler");

module.exports = function registerHandlers(io, socket) {
  kioskHandler(io, socket);
  shopHandler(io, socket);
  adminHandler(io, socket);
};
