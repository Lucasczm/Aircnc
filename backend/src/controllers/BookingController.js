const Booking = require('../models/Booking');
const Spot = require('../models/Spot');

module.exports = {
  async store(req, res) {
    const { userId } = req;
    const { spotId } = req.params;
    const { date } = req.body;
    const { user } = await Spot.findById(spotId);
    if (!user) {
      return res.status(404);
    }
    const booking = await Booking.create({
      user: userId,
      spot: spotId,
      ownerUser: user,
      date
    });
    await booking
      .populate('spot')
      .populate('user')
      .execPopulate();

    const ownerSocket = req.connectedUsers[booking.spot.user];
    if (ownerSocket) {
      req.io.to(ownerSocket).emit('booking_request', booking);
    }
    return res.send(booking);
  },
  async index(req, res) {
    const booking = await Booking.find({
      ownerUser: req.userId,
      approved: null
    }).populate(['user', 'spot']);
    return res.send(booking);
  }
};
