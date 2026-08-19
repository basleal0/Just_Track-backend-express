import { z } from "zod";
export declare const createHabitSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<{
        HEALTH: 'HEALTH';
        MIND: 'MIND';
        PRODUCTIVITY: 'PRODUCTIVITY';
    }>;
    frequency: z.ZodEnum<{
        EVERY_DAY: 'EVERY_DAY';
        WEEKDAYS: 'WEEKDAYS';
        WEEKENDS: 'WEEKENDS';
    }>;
    coverImageUrl: z.ZodOptional<z.ZodString>;
    reminderTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
