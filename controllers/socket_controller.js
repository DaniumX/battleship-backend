const debug = require("debug")("battleship:socket_controller");
let io = null;
let users = [];

const handleUserJoined = function (user) {
  debug(`Player ${user} joined game`);

  if (!players.length) {
    const userOne = {
      id: this.id,
      room: this.id,
      username: user,
      isPlayersTurn: true,
    };
    this.join(userOne.room);
    users.push(userOne);
    io.to(userOne.room).emit("users:profiles", users);
    return;
  }
  if (users.length) {
    const userTwo = {
      id: this.id,
      room: players[0].room,
      username: user,
      isPlayersTurn: false,
    };
    this.join(userTwo.room);
    users.push(userTwo);
    io.to(userTwo.room).emit("users:profiles", users);
    return;
  }

  this.emit("lobby:full");
  delete this.id;
  return;
};

const handleDisconnect = function () {
  debug(`Client ${this.id} disconnected :(`);

  const removeUser = (id) => {
    if (users.findIndex((user) => user.id === id) !== -1)
      return users.splice(
        users.findIndex((user) => user.id === id),
        1
      )[0];
  };

  if (removeUser(this.id))
    io.to(removeUser(this.id).room).emit("user:disconnected", true);
};

const handleShot = function (target) {
  this.broadcast.emit("user:fire", target);
};

const handleShotResponse = function (id, boolean) {
  console.log(`Shot hit? ${boolean}`);
  this.broadcast.emit("user:shot-received", id, boolean);
};

const handleSunkenShip = function (id) {
  this.broadcast.emit("user:ship-sunken-response", id);
};

module.exports = function (socket, _io) {
  io = _io;

  debug(`Client ${socket.id} connected`);

  socket.on("disconnect", handleDisconnect);
  socket.on("user:joined", handleUserJoined);
  socket.on("user:shot", handleShot);
  socket.on("user:shot-response", handleShotResponse);
  socket.on("player:ship-sunken", handleSunkenShip);
};
