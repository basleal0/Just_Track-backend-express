import { z } from "zod";
export declare const createNotificationSchema: z.ZodObject<{
    notificationId: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateNotificationSchema: z.ZodObject<{
    done: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
