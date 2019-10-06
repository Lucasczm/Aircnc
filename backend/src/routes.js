const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const auth = require('./middleware/Auth');

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const SpotController = require('./controllers/SpotController');
const DashboardController = require('./controllers/DashboardController');
const BookingController = require('./controllers/BookingController');
const ApprovalController = require('./controllers/ApprovalController');
const RejectionController = require('./controllers/RejectionController');
const ResetPasswordController = require('./controllers/ResetPasswordController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.get('/spots', SpotController.index);
routes.post('/spots', [auth, upload.single('thumbnail')], SpotController.store);

routes.get('/dashboard', auth, DashboardController.show);

routes.post('/spots/:spotId/bookings', auth, BookingController.store);

routes.get('/bookings', auth, BookingController.index);
routes.post('/bookings/:bookingId/approvals', auth, ApprovalController.store);
routes.post('/bookings/:bookingId/rejections', auth, RejectionController.store);

routes.get('/bookings/approvals', auth, ApprovalController.index);
routes.get('/mybookings', auth, ApprovalController.myBookings);

routes.post('/recover', ResetPasswordController.store);
routes.put('/recover', ResetPasswordController.changePassword);

module.exports = routes;
