const Spot = require('../models/Spot');

module.exports = {
  async index(req, res) {
    const { tech } = req.query;
    const spots = await Spot.find({ techs: tech });
    return res.send(spots);
  },
  async store(req, res) {
    const { userid } = req.headers;
    const { company, techs, price } = req.body;

    const spot = await Spot.create({
      user: userid,
      thumbnail: req.file.filename,
      company,
      techs: techs.split(',').map(tech => tech.trim()),
      price
    });
    return res.send(spot);
  }
};
