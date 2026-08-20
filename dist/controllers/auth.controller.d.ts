import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
export declare const googleLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const googleCallback: (req: Request, res: Response, next: NextFunction) => void;
