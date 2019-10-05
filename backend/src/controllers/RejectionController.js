const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('spot');
    if (
      String(booking.spot.user) !== req.userId ||
      booking.approved !== undefined
    ) {
      return res.status(401).send();
    }
    booking.approved = false;
    await booking.save();

    const userSocket = req.connectedUsers[booking.user];
    if (userSocket) {
      req.io.to(userSocket).emit('booking_response', booking);
    }

    return res.send(booking);
  }
};
