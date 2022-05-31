const debug = require("debug")("battleship:socket_controller");
let io = null;
let players = [];

const handlePlayerJoined = function (user) {
  debug(`Player ${user} joined game`);

  if (!players.length) {
    const userOne = {
      id: this.id,
      room: this.id,
      username: user,
      isPlayersTurn: true,
    };
    this.join(userOne.room);
    players.push(userOne);
    io.to(userOne.room).emit("users:profiles", players);
    return;
  }
  if (players.length) {
    const userTwo = {
      id: this.id,
      room: players[0].room,
      username: user,
      isPlayersTurn: true,
    };
    this.join(userTwo.room);
    players.push(userTwo);
    io.to(playerTwo.room).emit("users:profiles", players);
    return;
  }

  this.emit("lobby:full");
  delete this.id;
  return;
};

const handleDisconnect = function () {
  debug(`Client ${this.id} disconnected :(`);

  const removeUser = (id) => {
    if (players.findIndex((player) => player.id === id) !== -1)
      return players.splice(
        players.findIndex((player) => player.id === id),
        1
      )[0];
  };

  if (removeUser(this.id))
    io.to(removeUser(this.id).room).emit("user:disconnected", true);
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
