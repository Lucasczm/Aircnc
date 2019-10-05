const Spot = require('../models/Spot');

module.exports = {
  async index(req, res) {
    //const { tech } = req.query;
    const spots = await Spot.find();
    return res.send(spots);
  },
  async store(req, res) {
    const { userId } = req;
    const { company, techs, price } = req.body;

    let url;
    if (!req.file)
      return res.status(400).send({ error: 'Imagem não suportada' });
    if (req.file.size > 2 * 1024 * 1024) {
      return res
        .status(400)
        .send({ error: 'Tamanho é muito grande. Maxímo 2MB' });
    }
    if (req.file.transforms) {
      url = req.file.transforms[0].location;
    } else {
      url = `localURL-${req.file.key}`;
    }
    if (!url) {
      return res
        .status(400)
        .send({ error: 'Não foi possivel realizar o upload' });
    }

    const spot = await Spot.create({
      user: userId,
      thumbnail: url,
      company,
      techs: techs.split(',').map(tech => tech.trim()),
      price
    });
    return res.send(spot);
  }
};
