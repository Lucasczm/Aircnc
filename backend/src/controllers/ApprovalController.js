const Booking = require('../models/Booking');

module.exports = {
  async index(req, res) {
    const booking = await Booking.find({
      ownerUser: req.userId,
      approved: true
    }).populate(['spot', 'user']);
    return res.send(booking);
  },

  async myBookings(req, res) {
    const booking = await Booking.find({
      user: req.userId
    }).populate('spot');
    return res.send(booking);
  },

  async store(req, res) {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('spot');
    if (
      String(booking.spot.user) !== req.userId ||
      booking.approved !== undefined
    ) {
      return res.status(401).send();
    }
    booking.approved = true;
    await booking.save();

    const userSocket = req.connectedUsers[booking.user];
    if (userSocket) {
      req.io.to(userSocket).emit('booking_response', booking);
    }

    return res.send(booking);
  }
};
