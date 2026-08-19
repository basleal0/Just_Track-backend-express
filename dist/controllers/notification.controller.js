import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { createNotificationSchema, updateNotificationSchema, } from "../schemas/notification.schema.js";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export const createNotification = async (req, res) => {
    try {
        const userId = req.user?.id; // Automatically injected by Passport JWT
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: Missing userId" });
            return;
        }
        const validation = createNotificationSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                error: "Validation failed",
                details: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const { notificationId, title, body } = validation.data;
        const notification = await prisma.notification.create({
            data: {
                userId,
                notificationId,
                title,
                body,
            },
        });
        res.status(201).json(notification);
    }
    catch (error) {
        console.error("Create Notification Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
// GET /notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Automatically injected by Passport JWT
        if (!userId) {
            res.status(401).json({ error: "Unauthorized: Missing userId" });
            return;
        }
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
// PATCH /notifications/:id
export const updateNotification = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) {
            res.status(400).json({ error: "Missing notification id parameter" });
            return;
        }
        const validation = updateNotificationSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                error: "Validation failed",
                details: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const notificationExists = await prisma.notification.findUnique({
            where: { id },
        });
        if (!notificationExists) {
            res.status(404).json({ error: "Notification not found" });
            return;
        }
        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: validation.data,
        });
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        console.error("Update Notification Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
// DELETE /notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id) {
            res.status(400).json({ error: "Missing notification id parameter" });
            return;
        }
        const notificationExists = await prisma.notification.findUnique({
            where: { id },
        });
        if (!notificationExists) {
            res.status(404).json({ error: "Notification not found" });
            return;
        }
        await prisma.notification.delete({
            where: { id },
        });
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        console.error("Delete Notification Error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || String(error),
        });
    }
};
//# sourceMappingURL=notification.controller.js.map