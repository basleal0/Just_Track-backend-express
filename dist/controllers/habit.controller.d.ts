import "dotenv/config";
import type { Request, Response } from "express";
export declare const createHabit: (req: Request, res: Response) => Promise<void>;
export declare const getHabitById: (req: Request, res: Response) => Promise<void>;
