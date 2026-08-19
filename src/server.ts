import express from "express";
import habitRoutes from "./routes/habit.routes.js";
import authRoutes from "./routes/auth.routes.js";
import "./config/password.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import habitLogRoutes from "./routes/habitLog.route.js"
import settingRoutes from "./routes/setting.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// Routes
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);
app.use("/habitLogs",habitLogRoutes);
app.use("/setting", settingRoutes);
app.use("/notification",notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});