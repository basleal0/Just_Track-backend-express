import "dotenv/config"; // Ensure process.env.DATABASE_URL is loaded
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { createHabitSchema } from "../schemas/habit.schema.js";

// Initialize Pool and PrismaClient
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const createHabit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).id; // Automatically injected by Passport JWT

    // 1. Validate request body
    const validation = createHabitSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, category, frequency, coverImageUrl, reminderTime } =
      validation.data;

    // 2. Verify target user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      res.status(404).json({ error: "User not found with provided userId" });
      return;
    }

    // 3. Create habit record
    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        category,
        frequency,
        coverImageUrl,
        reminderTime,
      },
    });

    // 4. Return success response
    res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error: any) {
    console.error("Create Habit Detailed Error:", error);

    // Return full error details in JSON response to diagnose exact issue
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
      code: error?.code,
    });
  }
};
export const getHabitById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
   const id = req.params.id as string;

    // Fetch only the habit matching the ID
    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }

    res.status(200).json({ habit });
  } catch (error: any) {
    console.error("Get Habit By ID Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
    });
  }
};
