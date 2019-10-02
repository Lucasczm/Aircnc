const Spot = require('../models/Spot');

module.exports = {
  async show(req, res) {
    const { userId } = req;
    const spots = await Spot.find({ user: userId });
    return res.send(spots);
  }
};
