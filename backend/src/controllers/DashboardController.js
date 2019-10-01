const Spot = require('../models/Spot');

module.exports = {
  async show(req, res) {
    const { userid } = req.headers;
    const spots = await Spot.find({ user: userid });
    return res.send(spots);
  }
};
