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
 *     tags:
 *       - Settings
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     themeAccent:
 *                       type: string
 *                       example: "#6C63FF"
 *                     dailyReminders:
 *                       type: boolean
 *                       example: true
 *                     streakAlerts:
 *                       type: boolean
 *                       example: true
 *                     darkMode:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, getSettings);

/**
 * @openapi
 * /setting:
 *   patch:
 *     summary: Update user settings
 *     tags:
 *       - Settings
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
 *                 type: boolean
 *                 example: true
 *               darkMode:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Settings updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     themeAccent:
 *                       type: string
 *                       example: "#6C63FF"
 *                     dailyReminders:
 *                       type: boolean
 *                       example: true
 *                     streakAlerts:
 *                       type: boolean
 *                       example: true
 *                     darkMode:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid payload or request body
 *       401:
 *         description: Unauthorized
 */
router.patch("/", requireAuth, updateSettings);

export default router;
