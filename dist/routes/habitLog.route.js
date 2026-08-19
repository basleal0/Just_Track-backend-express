import { Router } from "express";
import { getHabitLogs, updateHabitLog } from "../controllers/habitLog.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
const router = Router();
// GET /habit-logs - Fetch logs by single date or date range
router.get("/getHabitLogs", requireAuth, getHabitLogs);
router.put("/:habitId/logs/:date", requireAuth, updateHabitLog);
export default router;
//# sourceMappingURL=habitLog.route.js.map