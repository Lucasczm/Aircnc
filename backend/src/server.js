require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');

const corsConfig = require('./config/cors');
const routes = require('./routes.js');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const connectedUsers = {};

const { APP_SECRET } = process.env;

io.on('connection', socket => {
  const { token } = socket.handshake.query;
  if (!token) return;
  const { userId } = jwt.decode(token, APP_SECRET);
  connectedUsers[userId] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(cors(corsConfig));
app.use(express.json());
app.use(routes);
server.listen(process.env.PORT || 3333);
console.log(`Running on port ${process.env.PORT || 3333}`);
