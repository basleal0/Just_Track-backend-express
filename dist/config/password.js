import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_jwt_key";
// Helper extractor function to pull token from cookies
const cookieExtractor = (req) => {
    let token = null;
    const reqWithCookies = req;
    if (reqWithCookies && reqWithCookies.cookies) {
        token = reqWithCookies.cookies["token"] ?? null;
    }
    return token;
};
// 1. Local Strategy for POST /auth/login
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return done(null, false, { message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// 2. JWT Strategy for Protecting Routes
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor, // Checks req.cookies.token first
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback to Authorization: Bearer <token>
    ]),
    secretOrKey: JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: jwtPayload.userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                isPremium: true,
            },
        });
        if (!user) {
            return done(null, false);
        }
        return done(null, user); // Attaches user object to req.user
    }
    catch (error) {
        return done(error, false);
    }
}));
export default passport;
//# sourceMappingURL=password.js.map