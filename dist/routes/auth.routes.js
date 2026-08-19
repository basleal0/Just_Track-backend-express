import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
const router = Router();
router.post("/register", signup);
router.post("/login", login);
export default router;
//# sourceMappingURL=auth.routes.js.map