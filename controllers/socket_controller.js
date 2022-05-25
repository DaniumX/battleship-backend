const debug = require("debug")("battleship:socket_controller");
let io = null;

const handleDisconnect = function () {
  debug(`Client ${this.id} disconnected :(`);
};

const handleJoinGame = function () {
  debug(`Client ${this.id} wants to join the game`);

  io.emit("join:game");
};

module.exports = function (socket, _io) {
  io = _io;

  debug(`Client ${socket.id} connected`);

  socket.on("disconnect", handleDisconnect);

  socket.on("battleship:start", handleJoinGame);
};
