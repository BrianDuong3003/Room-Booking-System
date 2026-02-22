import express from 'express';
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import bookingRoutes from './booking.routes';
import scheduleRoutes from './schedule.routes';

const router = express.Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/schedules', scheduleRoutes);

export default router;