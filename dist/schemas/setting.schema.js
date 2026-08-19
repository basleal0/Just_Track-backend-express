import { z } from "zod";
export const updateSettingsSchema = z.object({
    dailyReminders: z.boolean().optional(),
    streakAlerts: z.boolean().optional(),
    darkMode: z.boolean().optional(),
    themeAccent: z.string().optional(),
    timezone: z.string().optional(),
});
//# sourceMappingURL=setting.schema.js.map