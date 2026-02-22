import { body, param, query, ValidationChain } from 'express-validator';
import { UserRole, RoomStatus, BookingStatus, DeviceType } from '@prisma/client';
import { config } from '../config';

// Auth validation
export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .custom((value) => {
      const domain = value.split('@')[1];
      if (domain !== config.email.domain) {
        throw new Error(`Email must end with @${config.email.domain}`);
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Invalid user role'),
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidation: ValidationChain[] = [
  body('old_password').notEmpty().withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Room validation
export const createRoomValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Room name is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('buildingId').notEmpty().withMessage('Building ID is required'),
  body('floor').isInt({ min: 0 }).withMessage('Valid floor number is required'),
  body('status')
    .optional()
    .isIn(Object.values(RoomStatus))
    .withMessage('Invalid room status'),
];

export const updateRoomValidation: ValidationChain[] = [
  param('id').notEmpty().withMessage('Room ID is required'),
  body('name').optional().notEmpty().withMessage('Room name cannot be empty'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid capacity is required'),
  body('floor')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Valid floor number is required'),
  body('status')
    .optional()
    .isIn(Object.values(RoomStatus))
    .withMessage('Invalid room status'),
];

// Building validation
export const createBuildingValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Building name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('floors').isInt({ min: 1 }).withMessage('Valid floors count is required'),
  body('closingTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Closing time must be in format HH:MM'),
];

// Booking validation
export const createBookingValidation: ValidationChain[] = [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('purpose').notEmpty().withMessage('Booking purpose is required'),
];

export const updateBookingValidation: ValidationChain[] = [
  param('id').notEmpty().withMessage('Booking ID is required'),
  body('status')
    .optional()
    .isIn(Object.values(BookingStatus))
    .withMessage('Invalid booking status'),
  body('startTime').optional().isISO8601().withMessage('Valid start time is required'),
  body('endTime').optional().isISO8601().withMessage('Valid end time is required'),
  body('purpose').optional().notEmpty().withMessage('Booking purpose cannot be empty'),
];

export const bookRoomValidation: ValidationChain[] = [
  body('roomScheduleId')
    .notEmpty()
    .withMessage('Room schedule ID is required')
    .isUUID()
    .withMessage('Invalid room schedule ID format'),
  body('purpose')
    .notEmpty()
    .withMessage('Booking purpose is required')
    .isString()
    .withMessage('Purpose must be a string')
    .isLength({ min: 3, max: 200 })
    .withMessage('Purpose must be between 3 and 200 characters'),
];

export const cancelBookingValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isUUID()
    .withMessage('Invalid booking ID format'),
];

// Device Control validation
export const updateDeviceValidation: ValidationChain[] = [
  param('id').notEmpty().withMessage('Device ID is required'),
  body('status').isBoolean().withMessage('Status must be a boolean'),
];

export const createDeviceValidation: ValidationChain[] = [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('deviceType')
    .isIn(Object.values(DeviceType))
    .withMessage('Invalid device type'),
  body('status').isBoolean().withMessage('Status must be a boolean'),
];