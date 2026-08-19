import { Router } from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @openapi
 * /notification:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, message]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Habit Reminder
 *               message:
 *                 type: string
 *                 example: Don't forget to log your daily hydration!
 *               type:
 *                 type: string
 *                 example: REMINDER
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, createNotification);

/**
 * @openapi
 * /notification:
 *   get:
 *     summary: Get all notifications for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, getNotifications);

/**
 * @openapi
 * /notification/{id}:
 *   patch:
 *     summary: Update a notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *                 example: true
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.patch("/:id", requireAuth, updateNotification);

/**
 * @openapi
 * /notification/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", requireAuth, deleteNotification);

export default router;