const { Server } = require("socket.io");
const authSocket = require("./auth");
const registerHandlers = require("./handlers");

/**
 * Gắn Socket.IO vào HTTP server.
 * Sau này: kiosk báo online/offline, shop/admin xem realtime.
 */
module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(authSocket);

  io.on("connection", (socket) => {
    registerHandlers(io, socket);
  });

  return io;
};
