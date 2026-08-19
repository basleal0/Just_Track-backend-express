import "dotenv/config";
import type { Request, Response } from "express";
export declare const updateHabitLog: (req: Request, res: Response) => Promise<void>;
export declare const getHabitLogs: (req: Request, res: Response) => Promise<void>;
