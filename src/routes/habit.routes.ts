import { createHabit, getHabitById } from "@/controllers/habit.controller.js";
import express from "express";
import { requireAuth } from "@/middlewares/auth.middlewares.js";
const router = express.Router();
router.post("/create",requireAuth, createHabit);
router.get("/getHabit/:id",requireAuth, getHabitById);


export default router;
