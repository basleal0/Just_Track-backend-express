import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { signupSchema, loginSchema } from "../schemas/auth.schema.js";

const isProduction = true;
const CLIENT_URL = process.env.CLIENT_URL || "https://localhost:3000";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_jwt_key";

// POST /auth/signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, fullName } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        settings: { create: {} },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        isPremium: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error?.message || String(error),
    });
  }
};

// POST /auth/login (using Passport custom callback)
export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      error: "Validation failed",
      details: validation.error.flatten().fieldErrors,
    });
    return;
  }

  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Internal server error", message: err.message });
      }

      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Authentication failed" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      });
    },
  )(req, res, next);
};

// GET /auth/google
export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

// GET /auth/google/callback
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate(
    "google",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err || !user) {
        const errorMsg = encodeURIComponent(
          info?.message || "Google authentication failed",
        );
        return res.redirect(`${CLIENT_URL}/login?error=${errorMsg}`);
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend application after setting cookie
      return res.redirect(`${CLIENT_URL}/dashboard`);
    },
  )(req, res, next);
};
