// import { prisma } from '../../prisma';
import { Prisma, Room } from '@prisma/client';
import { PaginationOptions } from './index';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new room
export const createRoom = async (data: Prisma.RoomCreateInput): Promise<Room> => {
  return prisma.room.create({
    data
  });
};

// Get room by ID
export const getRoomById = async (id: string): Promise<Room | null> => {
  return prisma.room.findUnique({
    where: { id }
  });
};

// Get all rooms with optional pagination
export const getAllRooms = async (options?: PaginationOptions): Promise<{rooms: Room[], total: number}> => {
  const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = options || {};
  const skip = (page - 1) * limit;

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.room.count()
  ]);

  return { rooms, total };
};

// Update a room
export const updateRoom = async (id: string, data: Prisma.RoomUpdateInput): Promise<Room | null> => {
  return prisma.room.update({
    where: { id },
    data
  });
};

// Delete a room
export const deleteRoom = async (id: string): Promise<Room | null> => {
  return prisma.room.delete({
    where: { id }
  });
};

// // Get available rooms (not booked during a specific time frame)
// export const getAvailableRooms = async (startTime: Date, endTime: Date): Promise<Room[]> => {
//   // Find rooms that don't have bookings overlapping with the specified time frame
//   const bookedRoomIds = await prisma.booking.findMany({
//     where: {
//       OR: [
//         { 
//           AND: [
//             { startTime: { lte: startTime } },
//             { endTime: { gt: startTime } }
//           ]
//         },
//         {
//           AND: [
//             { startTime: { lt: endTime } },
//             { endTime: { gte: endTime } }
//           ]
//         },
//         {
//           AND: [
//             { startTime: { gte: startTime } },
//             { endTime: { lte: endTime } }
//           ]
//         }
//       ]
//     },
//     select: {
//       roomId: true
//     }
//   });

//   // Get all rooms that are not in the bookedRoomIds list
//   return prisma.room.findMany({
//     where: {
//       id: {
//         notIn: bookedRoomIds.map(booking => booking.roomId)
//       }
//     }
//   });
// };

// Search rooms by name or description
// Search rooms by name or other available fields
export const searchRooms = async (searchTerm: string): Promise<Room[]> => {
    return prisma.room.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm} },
          // Remove description search if it's not in your schema
          // You can add other searchable fields from your Room model here
          { description: { contains: searchTerm } },
        ]
      }
    });
  };