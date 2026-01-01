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
router.get("/refresh", ctrl.refresh);
router.delete(
  "/delete",
  isAuthenticated,
  validateBody(schemas.joiDeleteSchema),
  ctrl.userDelete
);

router.post(
  "/forgot-password",
  validateBody(schemas.joiforgotPasswordSchema),
  ctrl.forgotPassword
);
router.post(
  "/reset-password/:resetPasswordToken",
  validateBody(schemas.joiResetPasswordSchema),
  ctrl.resetPassword
);

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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "profile"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github"),
  ctrl.facebookSignup
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  ctrl.facebookSignup
);

export default router;
