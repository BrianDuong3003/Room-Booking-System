import { Request, Response } from 'express';
import {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
  // getAvailableRooms,
  searchRooms,
} from '../models/room.model';
import { PaginationOptions } from '../models/index';

// Create a new room
export const create = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    // if (req.user?.role !== 'ADMIN') {
    //   return res.status(403).json({
    //     error: 'You do not have permission to create rooms',
    //   });
    // }

    const { name, capacity, buildingId, floor, status = 'AVAILABLE' } = req.body;

    const room = await createRoom({
      name,
      capacity,
      building: {
        connect: { id: buildingId },
      },
      floor,
      status,
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      error: 'Failed to create room',
    });
  }
};

// Get all rooms with pagination
export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'name';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';

    const options: PaginationOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const { rooms, total } = await getAllRooms(options);

    res.status(200).json({
      rooms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      error: 'Failed to fetch rooms',
    });
  }
};

// Get room by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await getRoomById(id);

    if (!room) {
        res.status(404).json({
        error: 'Room not found',
      });
    }

    res.status(200).json({
      room,
    });
  } catch (error) {
    console.error('Get room by id error:', error);
    res.status(500).json({
      error: 'Failed to fetch room',
    });
  }
};

// Update a room
export const update = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    // if (req.user?.role !== 'ADMIN') {
    //     res.status(403).json({
    //     error: 'You do not have permission to update rooms',
    //   });
    // }

    const { id } = req.params;
    const { name, capacity, buildingId, floor, status } = req.body;

    // Check if room exists
    const room = await getRoomById(id);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (floor !== undefined) updateData.floor = floor;
    if (status !== undefined) updateData.status = status;
    if (buildingId !== undefined) {
      updateData.building = {
        connect: { id: buildingId },
      };
    }

    const updatedRoom = await updateRoom(id, updateData);

    res.status(200).json({
      message: 'Room updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      error: 'Failed to update room',
    });
  }
};

// Delete a room
export const remove = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    // if (req.user?.role !== 'ADMIN') {
    //   return res.status(403).json({
    //     error: 'You do not have permission to delete rooms',
    //   });
    // }

    const { id } = req.params;

    // Check if room exists
    const room = await getRoomById(id);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
      });
    }

    await deleteRoom(id);

    res.status(200).json({
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      error: 'Failed to delete room',
    });
  }
};

// // Get available rooms for a specific time range
// export const getAvailable = async (req: Request, res: Response) => {
//   try {
//     const { startTime, endTime } = req.query;

//     if (!startTime || !endTime) {
//         res.status(400).json({
//         error: 'Start time and end time are required',
//       });
//     }

//     const parsedStartTime = new Date(startTime as string);
//     const parsedEndTime = new Date(endTime as string);

//     // Check if the end time is after the start time
//     if (parsedEndTime <= parsedStartTime) {
//         res.status(400).json({
//         error: 'End time must be after start time',
//       });
//     }

//     const availableRooms = await getAvailableRooms(parsedStartTime, parsedEndTime);

//     res.status(200).json({
//       availableRooms,
//     });
//   } catch (error) {
//     console.error('Get available rooms error:', error);
//     res.status(500).json({
//       error: 'Failed to fetch available rooms',
//     });
//   }
// };

// Search rooms
export const search = async (req: Request, res: Response) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({
        error: 'Search term is required',
      });
    }

    const rooms = await searchRooms(term as string);

    res.status(200).json({
      rooms,
    });
  } catch (error) {
    console.error('Search rooms error:', error);
    res.status(500).json({
      error: 'Failed to search rooms',
    });
  }
};

// // Filter rooms with time
// export const filter = async (req: Request, res: Response) => {
//   try {
//     const { startTime, endTime } = req.query;

//     if (!startTime || !endTime) {
//       return res.status(400).json({
//         error: 'Start time and end time are required',
//       });
//     }

//     const parsedStartTime = new Date(startTime as string);
//     const parsedEndTime = new Date(endTime as string);

//     // Check if the end time is after the start time
//     if (parsedEndTime <= parsedStartTime) {
//       return res.status(400).json({
//         error: 'End time must be after start time',
//       });
//     }

//     const rooms = await getAvailableRooms(parsedStartTime, parsedEndTime);

//     res.status(200).json({
//       rooms,
//     });
//   } catch (error) {
//     console.error('Filter rooms error:', error);
//     res.status(500).json({
//       error: 'Failed to filter rooms',
//     });
//   }
// };