import express from "express";
import * as scheduleController from "../controllers/schedule.controller";
// import { authenticate } from '../middlewares/auth.middleware';
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// router.get("/", (req, res) => {
//   scheduleController.getAllSchedule(req, res);
// });

// router.get("/room/:roomId", (req, res) => {
//   scheduleController.getRoomSchedule(req, res);
// });

router.get("/available", (req, res) => {
  scheduleController.getSchedulesInTimeRange(req, res);
});

router.get("/:id", (req, res) => {
  scheduleController.getRoomScheduleById(req, res);
});

router.post("/create",protect, (req, res) => {
  scheduleController.createRoomSchedule(req, res);
});

router.get("/", protect,(req, res) => {
//  Add debugging information
  scheduleController.getAllRoomSchedules(req, res);
});

router.get("/room/:roomName",protect, (req, res) => {
  scheduleController.getRoomScheduleByName(req, res);
});

router.put("/:id", protect, (req, res) => {
  scheduleController.updateRoomSchedule(req, res);
});

router.delete("/:id",protect, (req, res) => {
  scheduleController.deleteRoomSchedule(req, res);
});

export default router;
