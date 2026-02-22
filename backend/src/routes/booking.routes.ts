import express from 'express';
import * as bookingController from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { bookRoomValidation, cancelBookingValidation } from '../utils/validation';
// import { authorizeAdmin } from '../middlewares/authorize.middleware';

const router = express.Router();

// User routes
router.get('/my-bookings', protect, (req, res) => {
    bookingController.getMyBookings(req, res);
}
);
// Create a new booking
router.post('/book', protect, validate(bookRoomValidation), (req, res) => {
    bookingController.create(req, res);
});
// Get booking of a user by room name and date range
router.get('/:roomName', protect, (req, res) => {
    bookingController.getBookingsByRoomName(req, res);
});
// Cancel a booking
router.post('/cancel/:id', protect, validate(cancelBookingValidation), (req, res) => {
    bookingController.cancelBooking(req, res);
});



// // Admin routes
// router.get('/', protect, authorizeAdmin, bookingController.getAllBookings);
// router.get('/date/:date', protect, authorizeAdmin, bookingController.getBookingsByDate);
// router.get('/user/:userId', protect, authorizeAdmin, bookingController.getBookingsByUserId);
// router.put('/:id/approve', protect, authorizeAdmin, bookingController.approveBooking);
// router.put('/:id/reject', protect, authorizeAdmin, bookingController.rejectBooking);

export default router;