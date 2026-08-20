import { Router } from "express";
import { signup, login, googleLogin, googleCallback, } from "../controllers/auth.controller.js";
const router = Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use or invalid payload
 */
router.post("/register", signup);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in user and receive HTTP-only auth cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);
/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth 2.0 sign-in flow
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects browser to Google OAuth consent screen
 */
router.get("/google", googleLogin);
/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth 2.0 redirect callback endpoint
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Authenticates user, sets HTTP-only JWT cookie, and redirects to client dashboard
 */
router.get("/google/callback", googleCallback);
export default router;
//# sourceMappingURL=auth.routes.js.map