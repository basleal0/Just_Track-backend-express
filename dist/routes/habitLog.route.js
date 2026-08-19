import { Router } from "express";
import { getHabitLogs, updateHabitLog } from "../controllers/habitLog.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
const router = Router();
/**
 * @openapi
 * /habitLogs/getHabitLogs:
 *   get:
 *     summary: Fetch habit logs by single date or date range
 *     tags: [Habit Logs]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Specific date (YYYY-MM-DD)
 *         example: "2026-08-19"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date for date range (YYYY-MM-DD)
 *         example: "2026-08-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date for date range (YYYY-MM-DD)
 *         example: "2026-08-31"
 *     responses:
 *       200:
 *         description: Habit logs retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/getHabitLogs", requireAuth, getHabitLogs);
/**
 * @openapi
 * /habitLogs/{habitId}/logs/{date}:
 *   put:
 *     summary: Update or create a habit log entry
 *     tags: [Habit Logs]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the habit to log
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Log date (YYYY-MM-DD)
 *         example: "2026-08-19"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Habit log updated successfully
 *       400:
 *         description: Invalid request parameter or body
 *       401:
 *         description: Unauthorized
 */
router.put("/:habitId/logs/:date", requireAuth, updateHabitLog);
export default router;
//# sourceMappingURL=habitLog.route.js.map