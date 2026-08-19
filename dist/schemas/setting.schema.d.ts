import { z } from "zod";
export declare const updateSettingsSchema: z.ZodObject<{
    dailyReminders: z.ZodOptional<z.ZodBoolean>;
    streakAlerts: z.ZodOptional<z.ZodBoolean>;
    darkMode: z.ZodOptional<z.ZodBoolean>;
    themeAccent: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
