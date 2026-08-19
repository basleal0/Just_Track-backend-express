import { z } from "zod";

export const createNotificationSchema = z.object({
  notificationId: z.string().min(1, "notificationId is required"),
  title: z.string().min(1, "title is required"),
  body: z.string().min(1, "body is required"),
  userId: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  done: z.boolean().optional(),
});