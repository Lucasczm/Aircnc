const domainWhitelist = JSON.parse(process.env.CORS);
module.exports = {
  origin(origin, callback) {
    if (domainWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
