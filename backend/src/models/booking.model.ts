import { PrismaClient, BookingStatus, RoomStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBookingInput {
  roomScheduleId: string;
  userId: string;
  purpose?: string;
}

export interface UpdateBookingInput {
  purpose?: string;
  version?: number;
  status?: BookingStatus;
}

export const createBooking = async (data: CreateBookingInput) => {
  return prisma.$transaction(async (tx) => {
    // First check if the room is already booked for this time slot
    const existingBooking = await tx.booking.findFirst({
      where: {
        roomScheduleId: data.roomScheduleId,
        status: {
          notIn: [BookingStatus.CANCELLED]
        }
      }
    });

    if (existingBooking) {
      throw new Error('This room is already booked for the requested time slot');
    }

    // If no conflict, create the booking with COMPLETED status
    const newBooking = await tx.booking.create({
      data: {
        ...data,
        status: BookingStatus.COMPLETED  // Set status to COMPLETED on creation
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

    // Update the room schedule status to RESERVED
    await tx.roomSchedule.update({
      where: {
        id: data.roomScheduleId
      },
      data: {
        status: RoomStatus.RESERVED  // Set status to RESERVED when a booking is made
      }
    });

    return newBooking;
  });
};

export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
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
};

export const getBookingsByUserId = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      RoomSchedule: {
        include: {
          room: {
            include: {
              building: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getBookingsByDate = async (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return prisma.booking.findMany({
    where: {
      RoomSchedule: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateBooking = async (id: string, data: UpdateBookingInput) => {
  let whereClause: any = { id };
  
  if (data.version !== undefined) {
    whereClause.version = data.version - 1;
  }
  
  return prisma.booking.update({
    where: whereClause,
    data,
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
};

export const deleteBooking = async (id: string) => {
  return prisma.booking.delete({
    where: { id }
  });
};

// Get bookings by room name
export const getBookingsByRoomName = async (roomName: string, startDate: Date, endDate: Date) => {
  return prisma.booking.findMany({
    where: {
      RoomSchedule: {
        room: {
          name: roomName
        },
        startTime: {
          gte: startDate,
          lte: endDate
        }
      }
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
export const getBookingsByUserIdAndStatus = async (userId: string, status: BookingStatus) => {
  return prisma.booking.findMany({
    where: { 
      userId,
      status 
    },
    include: {
      RoomSchedule: {
        include: {
          room: {
            include: {
              building: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};
