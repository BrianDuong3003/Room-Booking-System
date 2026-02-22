// import { prisma } from '../../prisma';
import { Booking, RoomStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new room schedule
export const createRoomSchedule = async (data: {
  roomId: string;
  startTime: Date;
  endTime: Date;
}) => {
  return prisma.roomSchedule.create({
    data,
    include: {
      room: true,
    },
  });
};

// Get room schedule by ID
export const getRoomScheduleById = async (id: string) => {
  return prisma.roomSchedule.findUnique({
    where: {
      id: id, // Fixed: Use the id parameter instead of undefined
    },
    include: {
      room: true,
      bookings: {
        include: {
          user: true,
        },
      },
    },
  });
};

// Get room schedule by room name and date range
export const getRoomScheduleByRoomName = async (
  roomName: string,
  startDate: Date,
  endDate: Date
) => {
  return prisma.roomSchedule.findMany({
    where: {
      room: {
        name: roomName,
      },
      AND: [{ startTime: { gte: startDate } }, { startTime: { lte: endDate } }],
    },
    include: {
      room: true,
      bookings: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

// Update a room schedule
export const updateRoomSchedule = async (
  id: string,
  data: {
    status?: RoomStatus;
    startTime?: Date;
    endTime?: Date;
  }
) => {
  return prisma.roomSchedule.update({
    where: { id },
    data,
    include: {
      room: true,
    },
  });
};

// Delete a room schedule
export const deleteRoomSchedule = async (id: string) => {
  return prisma.roomSchedule.delete({
    where: { id },
  });
};

// Get all room schedules (with pagination)
export const getAllRoomSchedules = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [schedules, total] = await Promise.all([
    prisma.roomSchedule.findMany({
      skip,
      take: limit,
      include: {
        room: true,
        bookings: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.roomSchedule.count(),
  ]);

  return { schedules, total };
};

export const getSchedulesInTimeRange = async (
  startTime: Date,
  endTime: Date,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const [schedules, total] = await Promise.all([
    prisma.roomSchedule.findMany({
      where: {
        startTime: { gte: startTime },
        endTime: { lte: endTime },
      },
      skip,
      take: limit,
      include: {
        room: true,
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.roomSchedule.count({
      where: {
        startTime: { gte: startTime },
        endTime: { lte: endTime },
      },
    }),
  ]);

  return { schedules, total };
};
