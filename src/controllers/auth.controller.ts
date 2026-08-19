import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { registerSchema } from "@/schemas/auth.schema.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate incoming body against Zod schema
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, fullName } = validation.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create User and default UserSettings atomically
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        settings: {
          create: {}, // Auto-creates UserSettings with schema defaults
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        isPremium: true,
        createdAt: true,
        settings: true,
      },
    });

    // 5. Generate JWT Access Token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" },
    );

    // 6. Return response
    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
