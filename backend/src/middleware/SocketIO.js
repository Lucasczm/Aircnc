const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const { APP_SECRET } = process.env;
const connectedUsers = {};
let io;

function SocketIO(server) {
  io = socketio(server);
  io.on('connection', socket => {
    const { token } = socket.handshake.query;
    if (!token) return;
    const tokenObject = jwt.decode(token, APP_SECRET);
    if (!tokenObject) return;
    connectedUsers[tokenObject.userId] = socket.id;
  });
}

SocketIO.prototype.middleware = function InjectSocketIO(req, res, next) {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
};

module.exports = SocketIO;
