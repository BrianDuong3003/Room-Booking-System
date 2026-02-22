import { Request, Response } from 'express';
import * as bookingModel from '../models/booking.model';
import { BookingStatus } from '@prisma/client';
import { PrismaClient } from "@prisma/client";
import { RoomStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Get all bookings (admin only)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
};

// Get bookings by date
export const getBookingsByDate = async (req: Request, res: Response) => {
  try {
    const dateStr = req.params.date;
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    const bookings = await bookingModel.getBookingsByDate(date);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings by date:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
};

// Get user's bookings
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const status = req.query.status as string || undefined;
    
    // If specific status is requested in query params, use it
    if (status === 'COMPLETED') {
      const bookings = await bookingModel.getBookingsByUserIdAndStatus(userId, BookingStatus.COMPLETED);
      return res.status(200).json(bookings);
    }
    
    // Default behavior - get all user's bookings
    const bookings = await bookingModel.getBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve your bookings' });
  }
};
// Get bookings by userId (admin function)
export const getBookingsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await bookingModel.getBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
};

// Create a new booking
export const create = async (req: Request, res: Response) => {
  try {
    const { roomScheduleId, purpose } = req.body;
    const userId = (req as any).user.id;
    
    // Get the room schedule details
    const roomSchedule = await import('../models/schedule.model').then(m => m.getRoomScheduleById(roomScheduleId));
    
    if (!roomSchedule) {
      return res.status(404).json({ message: 'Room schedule not found' });
    }
    
    // Validate schedule time (prevent booking in the past)
    const now = new Date();
    const scheduleStart = new Date(roomSchedule.startTime);
    
    if (scheduleStart < now) {
      return res.status(400).json({ 
        message: 'Cannot book a time slot in the past' 
      });
    }
    
    // Check for existing bookings in a transaction
    const isAvailable = await prisma.$transaction(async (tx) => {
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomScheduleId,
          status: { notIn: [BookingStatus.CANCELLED] }
        }
      });
      return !conflictingBooking;
    });
    
    if (!isAvailable) {
      return res.status(409).json({ 
        message: 'This time slot is already booked' 
      });
    }
    
    const booking = await bookingModel.createBooking({
      roomScheduleId,
      userId,
      purpose
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

// Delete booking
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    // Check if booking exists and belongs to the user
    const existingBooking = await bookingModel.getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (existingBooking.userId !== userId && (req as any).user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    await bookingModel.deleteBooking(id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};

// Approve booking (admin only)
export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingBooking = await bookingModel.getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const updatedBooking = await bookingModel.updateBooking(id, { 
      status: BookingStatus.CONFIRMED 
    });
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ message: 'Failed to approve booking' });
  }
};

// Reject booking (admin only)
export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingBooking = await bookingModel.getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const updatedBooking = await bookingModel.updateBooking(id, { 
      status: BookingStatus.CANCELLED 
    });
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Failed to reject booking' });
  }
};


// Get bookings by room name
export const getBookingsByRoomName = async (req: Request, res: Response) => {
  try {
    const { roomName } = req.params;
    let { startDate, endDate } = req.query;

    let sDate, eDate;

    if (startDate) {
      sDate = new Date(startDate as string);
      sDate.setHours(0, 0, 0, 0); // Set to the beginning of the provided start day
    } else {
      sDate = new Date();
      sDate.setHours(0, 0, 0, 0); // Default to the beginning of today
    }

    if (endDate) {
      eDate = new Date(endDate as string);
      eDate.setHours(23, 59, 59, 999); // Set to the end of the provided end day
    } else {
      eDate = new Date();
      eDate.setHours(23, 59, 59, 999); // Default to the end of today
    }

    // Validate dates
    if (isNaN(sDate.getTime())) {
      return res.status(400).json({ message: 'Invalid start date format' });
    }
    if (isNaN(eDate.getTime())) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }
    
    const bookings = await bookingModel.getBookingsByRoomName(roomName, sDate, eDate);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings by room name:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
}
// Cancel booking

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    // Check if booking exists and belongs to the user
    const existingBooking = await bookingModel.getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (existingBooking.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if already cancelled
    if (existingBooking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({ message: 'This booking is already cancelled' });
    }

    // Use transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      let resultBooking;
      
      // If status is COMPLETED, delete the booking instead of updating to CANCELLED
      if (existingBooking.status === BookingStatus.COMPLETED) {
        // Delete the booking
        await tx.booking.delete({
          where: { id }
        });
        
        resultBooking = { ...existingBooking, id };
      } else {
        // For other statuses, update to CANCELLED
        resultBooking = await tx.booking.update({
          where: { id },
          data: { 
            version: existingBooking.version + 1,
            status: BookingStatus.CANCELLED 
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            RoomSchedule: {
              include: {
                room: {
                  include: {
                    building: true
                  }
                }
              }
            }
          }
        });
      }
      
      // Check if there are any other active bookings for this room schedule
      const activeBookingsCount = await tx.booking.count({
        where: {
          roomScheduleId: existingBooking.roomScheduleId,
          id: { not: id },
          status: { notIn: [BookingStatus.CANCELLED] }
        }
      });
      
      // Only update room schedule status if no other active bookings exist
      if (activeBookingsCount === 0) {
        await tx.roomSchedule.update({
          where: {
            id: existingBooking.roomScheduleId
          },
          data: {
            status: RoomStatus.AVAILABLE
          }
        });
      }
      
      return resultBooking;
    });
    
    res.status(200).json({ 
      message: 'Booking cancelled successfully',
      booking: result 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    
    // Specific error handling for Prisma errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Concurrent modification detected' });
      } else if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Record to update not found' });
      }
    }
    
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};