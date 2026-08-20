import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_jwt_key";

// Helper extractor function to pull token from cookies
const cookieExtractor = (req: Request): string | null => {
  let token: string | null = null;
  const reqWithCookies = req as Request & { cookies?: Record<string, string> };

  if (reqWithCookies && reqWithCookies.cookies) {
    token = reqWithCookies.cookies["token"] ?? null;
  }
  return token;
};

// 1. Local Strategy for POST /auth/login
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
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
      } catch (error) {
        return done(error);
      }
    }
  )
);

// 2. JWT Strategy for Protecting Routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor, // Checks req.cookies.token first
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback to Authorization: Bearer <token>
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
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
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// 3. Google Strategy for OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const fullName = profile.displayName;

        if (!email) {
          return done(new Error("No email profile retrieved from Google"), false);
        }

        // 1. Look for existing user with this googleId
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // 2. If not found by googleId, check by email address
        if (!user) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link existing account with googleId
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId },
            });
          } else {
            // Create a new user account
            user = await prisma.user.create({
              data: {
                email,
                fullName,
                googleId,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

export default passport;