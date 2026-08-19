import { Router } from "express";
import { getSettings, updateSettings } from "@/controllers/setting.controller.js";
import { requireAuth } from "@/middlewares/auth.middlewares.js";

const router = Router();

// GET /habit-logs - Fetch logs by single date or date range
router.get("/",requireAuth, getSettings);
router.patch("/",requireAuth, updateSettings);

export default router;