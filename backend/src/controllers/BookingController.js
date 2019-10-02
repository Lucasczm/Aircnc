const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { userId } = req;
    const { spotid } = req.params;
    const { date } = req.body;
    const booking = await Booking.create({
      user: userId,
      spot: spotid,
      date
    });
    await booking
      .populate('spot')
      .populate('user')
      .execPopulate();
    return res.send(booking);
  }
};
