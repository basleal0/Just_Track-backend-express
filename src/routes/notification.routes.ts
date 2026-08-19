import { Router } from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = Router();

// GET /habit-logs - Fetch logs by single date or date range
router.post("/",requireAuth, createNotification);
router.get("/",requireAuth, getNotifications);
router.patch("/:id",requireAuth, updateNotification);
router.delete("/:id",requireAuth, deleteNotification);

export default router;
