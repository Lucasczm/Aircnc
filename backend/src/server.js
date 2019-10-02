require('dotenv/config');
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes.js');

const app = express();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);
app.listen(process.env.PORT || 3333);
console.log(`Running on port ${process.env.PORT || 3333}`);
