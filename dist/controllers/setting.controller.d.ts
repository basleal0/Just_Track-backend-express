import "dotenv/config";
import type { Request, Response } from "express";
export declare const getSettings: (req: Request, res: Response) => Promise<void>;
export declare const updateSettings: (req: Request, res: Response) => Promise<void>;
