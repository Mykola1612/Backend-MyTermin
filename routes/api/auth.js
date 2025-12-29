import express from "express";
import { validateBody, isAuthenticated } from "../../middlewares/index.js";
import { schemas } from "../../models/user.js";
import ctrl from "../../controllers/authController.js";

import passport from "passport";

const router = express.Router();

router.post("/signup", validateBody(schemas.joiSignupSchema), ctrl.signup);
router.post("/signin", validateBody(schemas.joiSigninSchema), ctrl.signin);
router.get("/current", isAuthenticated, ctrl.getCurrent);
router.post("/logout", isAuthenticated, ctrl.logout);

router.get("/verify/:verificationCode", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.joiresendEmailSchema),
  ctrl.resendVerifyEmail
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  ctrl.googleSignup
);

export default router;
