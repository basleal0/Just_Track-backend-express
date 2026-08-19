import "dotenv/config";
import type { Request, Response } from "express";
export declare const createNotification: (req: Request, res: Response) => Promise<void>;
export declare const getNotifications: (req: Request, res: Response) => Promise<void>;
export declare const updateNotification: (req: Request, res: Response) => Promise<void>;
export declare const deleteNotification: (req: Request, res: Response) => Promise<void>;
