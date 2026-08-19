import { Router } from "express";
import { getHabitLogs, updateHabitLog } from "@/controllers/habitLog.controller.js";


const router = Router();

// GET /habit-logs - Fetch logs by single date or date range
router.get("/getHabitLogs", getHabitLogs);
router.put("/:habitId/logs/:date", updateHabitLog);

export default router;