import { Request, Response } from "express";

export const createRoomSchedule = async (req: Request, res: Response) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({
        error: "Room ID, start time, and end time are required",
      });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (parsedEndTime <= parsedStartTime) {
      return res.status(400).json({
        error: "End time must be after start time",
      });
    }

    const schedule = await import("../models/schedule.model").then((module) =>
      module.createRoomSchedule({
        roomId,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
      })
    );

    res.status(201).json({
      message: "Room schedule created successfully",
      schedule,
    });
  } catch (error: any) {
    console.error("Create room schedule error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "A schedule for this room at this time already exists",
      });
    }
    res.status(500).json({
      error: "Failed to create room schedule",
    });
  }
};

// Get a room schedule by ID
export const getRoomScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing schedule ID" });
    }

    const schedule = await import("../models/schedule.model").then((module) =>
      module.getRoomScheduleById(id)
    );

    if (!schedule) {
      return res.status(404).json({
        error: "Room schedule not found",
      });
    }

    res.status(200).json({
      schedule,
    });
  } catch (error) {
    console.error("Get room schedule by ID error:", error);
    res.status(500).json({
      error: "Failed to fetch room schedule",
    });
  }
};

// Get room schedules by room name and date
export const getRoomScheduleByName = async (req: Request, res: Response) => {
  try {
    const { roomName } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: "Date is required",
      });
    }

    const parsedDate = new Date(date as string);

    // Create start and end of the provided date
    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await import("../models/schedule.model").then((module) =>
      module.getRoomScheduleByRoomName(roomName, startOfDay, endOfDay)
    );

    res.status(200).json({
      roomName,
      date: parsedDate,
      schedules,
    });
  } catch (error) {
    console.error("Get room schedule by room name error:", error);
    res.status(500).json({
      error: "Failed to fetch room schedule",
    });
  }
};

// Update a room schedule
export const updateRoomSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing schedule ID" });
    }

    if (!startTime && !endTime) {
      return res.status(400).json({
        error: "At least one field to update is required",
      });
    }

    const updateData: any = {};

    if (startTime) {
      updateData.startTime = new Date(startTime);
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }

    // Check if end time is after start time
    if (
      updateData.startTime &&
      updateData.endTime &&
      updateData.endTime <= updateData.startTime
    ) {
      return res.status(400).json({
        error: "End time must be after start time",
      });
    }

    const schedule = await import("../models/schedule.model").then((module) =>
      module.updateRoomSchedule(id, updateData)
    );

    res.status(200).json({
      message: "Room schedule updated successfully",
      schedule,
    });
  } catch (error: any) {
    console.error("Update room schedule error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Room schedule not found",
      });
    }
    res.status(500).json({
      error: "Failed to update room schedule",
    });
  }
};

// Delete a room schedule
export const deleteRoomSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing schedule ID" });
    }

    await import("../models/schedule.model").then((module) =>
      module.deleteRoomSchedule(id)
    );

    res.status(200).json({
      message: "Room schedule deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete room schedule error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Room schedule not found",
      });
    }
    res.status(500).json({
      error: "Failed to delete room schedule",
    });
  }
};

// Get all room schedules with pagination
export const getAllRoomSchedules = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    if (
      (page || limit) &&
      (isNaN(parsedPage) ||
        isNaN(parsedLimit) ||
        parsedPage < 1 ||
        parsedLimit < 1)
    ) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
      });
    }

    const result = await import("../models/schedule.model").then((module) =>
      module.getAllRoomSchedules(parsedPage, parsedLimit)
    );

    res.status(200).json({
      page: parsedPage,
      limit: parsedLimit,
      total: result.total,
      schedules: result.schedules,
    });
  } catch (error) {
    console.error("Get all room schedules error:", error);
    res.status(500).json({
      error: "Failed to fetch room schedules",
    });
  }
};

// Get schedules available within a time range
export const getSchedulesInTimeRange = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({
        error: "Start time and end time are required",
      });
    }

    const parsedStartTime = new Date(startTime as string);
    const parsedEndTime = new Date(endTime as string);
    const parsedPage = parseInt(page as string) || 1;
    const parsedLimit = parseInt(limit as string) || 10;

    if (parsedEndTime <= parsedStartTime) {
      return res.status(400).json({
        error: "End time must be after start time",
      });
    }

    const result = await import("../models/schedule.model").then((module) =>
      module.getSchedulesInTimeRange(
        parsedStartTime,
        parsedEndTime,
        parsedPage,
        parsedLimit
      )
    );

    res.status(200).json({
      page: parsedPage,
      limit: parsedLimit,
      total: result.total,
      schedules: result.schedules,
    });
  } catch (error) {
    console.error("Get schedules in time range error:", error);
    res.status(500).json({
      error: "Failed to fetch schedules in the specified time range",
    });
  }
};