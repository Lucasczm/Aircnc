require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const http = require('http');

const corsConfig = require('./config/cors');
const routes = require('./routes.js');
const Socket = require('./middleware/SocketIO');

const app = express();
const server = http.Server(app);
const io = new Socket(server);

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(io.middleware);
app.use(cors(corsConfig));
app.use(express.json());
app.use(routes);
server.listen(process.env.PORT || 3333);
console.log(`Running on port ${process.env.PORT || 3333}`);
