import "dotenv/config"; // Ensure process.env.DATABASE_URL is loaded
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { createHabitSchema } from "@/schemas/habit.schema.js";

// Initialize Pool and PrismaClient
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const updateHabitLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { habitId, date } = req.params;
    const { completed = true } = req.body;

    // 1. Parse date string and normalize to UTC midnight for strict matching
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      return;
    }

    const utcMidnight = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    );

    // 2. Verify target habit exists
    const habitExists = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habitExists) {
      res.status(404).json({ error: "Habit not found with provided habitId" });
      return;
    }

    // 3. Upsert HabitLog record using composite unique constraint @@unique([habitId, date])
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: utcMidnight,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        habitId,
        date: utcMidnight,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // 4. Return success response
    res.status(200).json({
      message: "Habit log updated successfully",
      log,
    });
  } catch (error: any) {
    console.error("Update Habit Log Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
    });
  }
};
export const getHabitLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, from, to } = req.query;

    const whereCondition: any = {};

    // Single date filter
    if (date && typeof date === "string") {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
        return;
      }
      const utcMidnight = new Date(
        Date.UTC(
          parsedDate.getUTCFullYear(),
          parsedDate.getUTCMonth(),
          parsedDate.getUTCDate()
        )
      );
      whereCondition.date = utcMidnight;
    } 
    // Date range filter (from - to)
    else if (from && to && typeof from === "string" && typeof to === "string") {
      const parsedFrom = new Date(from);
      const parsedTo = new Date(to);

      if (isNaN(parsedFrom.getTime()) || isNaN(parsedTo.getTime())) {
        res.status(400).json({ error: "Invalid from/to date format. Use YYYY-MM-DD" });
        return;
      }

      const fromUtc = new Date(
        Date.UTC(
          parsedFrom.getUTCFullYear(),
          parsedFrom.getUTCMonth(),
          parsedFrom.getUTCDate()
        )
      );
      const toUtc = new Date(
        Date.UTC(
          parsedTo.getUTCFullYear(),
          parsedTo.getUTCMonth(),
          parsedTo.getUTCDate()
        )
      );

      whereCondition.date = {
        gte: fromUtc,
        lte: toUtc,
      };
    }

    const logs = await prisma.habitLog.findMany({
      where: whereCondition,
      orderBy: { date: "asc" },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            category: true,
            frequency: true,
          },
        },
      },
    });

    res.status(200).json(logs);
  } catch (error: any) {
    console.error("Get Habit Logs Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
    });
  }
};