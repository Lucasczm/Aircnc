const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

const { APP_SECRET, TOKEN_EXPIRE } = process.env;

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).send({ error: 'Invalid login' });
    if (await user.comparePassword(password)) {
      const token = jwt.sign({ userId: user.id }, APP_SECRET, {
        expiresIn: parseInt(TOKEN_EXPIRE, 10) || 3600
      });
      const oldToken = await Token.findOne({ user: user.id });

      if (oldToken) {
        oldToken.token = token;
        await oldToken.save();
      } else {
        await Token.create({
          token,
          user
        });
      }

      return res.send({ auth: true, type: 'Bearer', token });
    }
    return res.status(401).send({ error: 'Invalid login' });
  }
};
