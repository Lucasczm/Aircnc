const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');

const { APP_SECRET, FRONTEND_RECOVERY_URL, EMAIL_DOMAIN } = process.env;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  async store(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Email not registered' });
    const token = jwt.sign({ userId: user.id }, APP_SECRET, {
      expiresIn: 3600
    });

    await ResetToken.create({ user: user.id, token });
    const recoverLink = FRONTEND_RECOVERY_URL + token;
    const html = fs.readFileSync(
      path.resolve(__dirname, '..', 'views', 'RecoveryPassword.html'),
      'utf8'
    );
    const msg = {
      to: email,
      from: `recovery@${EMAIL_DOMAIN}`,
      subject: 'Aircnc - Recupere sua senha',
      text: 'Recupere sua senha',
      html: html.replace(/{{ link }}/g, recoverLink)
    };
    await sgMail.send(msg);

    return res.send({ msg: 'Verify your email' });
  },

  async changePassword(req, res) {
    const { token, password } = req.body;
    try {
      const checkToken = await ResetToken.findOne({ token });
      if (!checkToken)
        return res
          .status(401)
          .send({ error: 'A valid password reset token is required' });
      const decodedToken = jwt.verify(token, APP_SECRET);
      const user = await User.findById(decodedToken.userId);
      user.password = password;
      await user.save();
      await ResetToken.deleteOne({ token });
      return res.send({ msg: 'Change password with success' });
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return res.status(401).send({ error: 'Token expired' });

      return res
        .status(401)
        .send({ error: 'A password reset token is required' });
    }
  }
};
