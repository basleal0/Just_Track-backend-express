import { createHabit, getHabitById } from "@/controllers/habit.controller.js";
import express from "express";
const router = express.Router();
router.post("/create", createHabit);
router.get("/getHabit/:id", getHabitById);


export default router;
