import express from "express";
import cors from "cors";
import habitRoutes from "./routes/habit.routes.js";
import authRoutes from "./routes/auth.routes.js";
import "./config/password.js";
import { setupSwagger } from "./config/swagger.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import habitLogRoutes from "./routes/habitLog.route.js";
import settingRoutes from "./routes/setting.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
const allowedOrigins = [
  "http://localhost:5173", // Local React/Vite development
  process.env.CLIENT_URL, // Live production frontend URL
  process.env.TESTING_URL,
].filter(Boolean) as string[];
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true, // Enables cookie passing cross-origin
  }),
);
app.use(express.json());
setupSwagger(app);
app.use(cookieParser());
app.use(passport.initialize());
// Routes
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);
app.use("/habitLogs", habitLogRoutes);
app.use("/setting", settingRoutes);
app.use("/notification", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
