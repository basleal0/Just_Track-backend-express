import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { updateSettingsSchema } from "../schemas/setting.schema.js";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export const getSettings = async (req, res) => {
    try {
        const userId = req.user.id; // Automatically injected by Passport JWT
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: Missing userId in request or x-user-id header" });
            return;
        }
        // Upsert ensures settings exist for this user
        const settings = await prisma.userSettings.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
        res.status(200).json(settings);
    }
    catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
export const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id; // Automatically injected by Passport JWT
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: Missing userId in request or x-user-id header" });
            return;
        }
        const validation = updateSettingsSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                error: "Validation failed",
                details: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId },
            update: validation.data,
            create: {
                userId,
                ...validation.data,
            },
        });
        res.status(200).json(updatedSettings);
    }
    catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
//# sourceMappingURL=setting.controller.js.map