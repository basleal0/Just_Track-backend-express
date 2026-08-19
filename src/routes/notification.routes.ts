import { Router } from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
} from "@/controllers/notification.controller.js";

const router = Router();

// GET /habit-logs - Fetch logs by single date or date range
router.post("/", createNotification);
router.get("/", getNotifications);
router.patch("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
