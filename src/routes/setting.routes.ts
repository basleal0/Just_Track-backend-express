import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/setting.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @openapi
 * /setting:
 *   get:
 *     summary: Get user settings
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, getSettings);

/**
 * @openapi
 * /setting:
 *   patch:
 *     summary: Update user settings
 *     tags: [Settings]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               themeAccent:
 *                 type: string
 *                 example: "#6C63FF"
 *               dailyReminders:
 *                 type: boolean
 *                 example: true
 *               streakAlerts:
 *                  type: booleean
 *                  example: true
 *               darkMode:
 *                   type: boolean
 *                    example: false
  
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid payload or request body
 *       401:
 *         description: Unauthorized
 */
router.patch("/", requireAuth, updateSettings);

export default router;