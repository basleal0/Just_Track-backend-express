import { z } from "zod";
import { Category, Frequency } from "@prisma/client";

export const createHabitSchema = z.object({
  userId: z.string().uuid("Invalid User ID format"),
  name: z.string().min(1, "Habit name is required").max(100),
  category: z.nativeEnum(Category, {
    message: "Category must be HEALTH, MIND, or PRODUCTIVITY",
  }),
  frequency: z.nativeEnum(Frequency, {
    message: "Frequency must be EVERY_DAY, WEEKDAYS, or WEEKENDS",
  }),
  coverImageUrl: z.string().url("Invalid image URL").optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Reminder time must be in HH:mm format (e.g. 07:30)")
    .optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;