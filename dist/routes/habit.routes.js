import express from "express";
import { createHabit, getHabitById } from "../controllers/habit.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
const router = express.Router();
/**
 * @openapi
 * /habits/create:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Read 20 pages
 *               description:
 *                 type: string
 *                 example: Read a non-fiction book every evening
 *               frequency:
 *                 type: string
 *                 example: DAILY
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Invalid input payload
 *       401:
 *         description: Unauthorized
 */
router.post("/create", requireAuth, createHabit);
/**
 * @openapi
 * /habits/getHabit/{id}:
 *   get:
 *     summary: Get habit details by ID
 *     tags: [Habits]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 */
router.get("/getHabit/:id", requireAuth, getHabitById);
export default router;
//# sourceMappingURL=habit.routes.js.map