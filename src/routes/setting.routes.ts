import { Router } from "express";
import { getSettings, updateSettings } from "@/controllers/setting.controller.js";


const router = Router();

// GET /habit-logs - Fetch logs by single date or date range
router.get("/", getSettings);
router.patch("/", updateSettings);

export default router;