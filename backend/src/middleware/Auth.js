const jwt = require('jsonwebtoken');

const { APP_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const mToken = authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(mToken, APP_SECRET);
    if (decodedToken) {
      req.userId = decodedToken.userId;
      return next();
    }
    throw new Error('Invalid Token');
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).send({ error: 'JWT Expired' });

    return res.status(401).send({ error: 'Authentication required' });
  }
};
