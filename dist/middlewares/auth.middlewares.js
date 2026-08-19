import passport from "passport";
export const requireAuth = passport.authenticate("jwt", { session: false });
//# sourceMappingURL=auth.middlewares.js.map