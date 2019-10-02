const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const auth = require('./middleware/Auth');

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const SpotController = require('./controllers/SpotController');
const DashboardController = require('./controllers/DashboardController');
const BookingController = require('./controllers/BookingController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.get('/spots', SpotController.index);
routes.post('/spots', [auth, upload.single('thumbnail')], SpotController.store);

routes.get('/dashboard', auth, DashboardController.show);

routes.post('/spots/:spotId/bookings', auth, BookingController.store);

module.exports = routes;
