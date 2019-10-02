const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

const { APP_SECRET, TOKEN_EXPIRE } = process.env;

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: 'Email already registered' });
    }
    user = await User.create({ email, password });

    const token = jwt.sign({ userId: user.id }, APP_SECRET, {
      expiresIn: parseInt(TOKEN_EXPIRE, 10) || 3600
    });

    await Token.create({
      token,
      user
    });

    return res.send({ auth: true, type: 'Bearer', token });
  }
};
