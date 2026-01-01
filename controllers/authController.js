import { env } from "../config/env.js";
import { ctrlWrapper } from "../helpers/index.js";
import tokenService from "../service/tokenService.js";
import userService from "../service/userService.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  await userService.signup(name, email, password);
  res.status(201).json({
    message: "User registered successfully",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  await userService.verifyEmail(verificationCode);
  res.json({
    message: "Email has been verified successfully",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  await userService.resendVerifyEmail(email);
  res.json({
    message: "Verification email sent successfully",
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  await userService.forgotPassword(email);
  res.json({
    message: "The email was poisoned",
  });
};

const resetPassword = async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;
  await userService.resetPassword(password, resetPasswordToken);
  res.json({
    message: "Password update succesfuly",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const signin = await userService.signin(email, password);
  res.cookie("refreshToken", signin.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: signin.accessToken });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const userRefresh = await userService.refresh(refreshToken);
  res.cookie("refreshToken", userRefresh.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json(userRefresh.userDateUpdate);
};

const userDelete = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const { _id } = req.user;
  const { password } = req.body;
  await userService.userDelete(_id, password);
  await tokenService.deleteToken(refreshToken);
  res.clearCookie("refreshToken");
  res.status(201).json({
    message: "User delete succesfuly",
  });
};

const getCurrent = async (req, res, next) => {
  const { email, name } = req.user;
  res.json({
    email,
    name,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await userService.logout(_id);
  res.clearCookie("refreshToken");
  res.json({
    message: "Logout successful",
  });
};

const googleSignup = async (req, res, next) => {
  const { _id } = req.user;
  const tokens = await userService.googleSignup(_id);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.redirect(`${env.frontendUrl}/facebook?token=${tokens.accessToken}`);
};

const facebookSignup = async (req, res, next) => {
  const { _id } = req.user;
  const tokens = await userService.facebookSignup(_id);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.redirect(`${env.frontendUrl}/facebook?token=${tokens.accessToken}`);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  googleSignup: ctrlWrapper(googleSignup),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  facebookSignup: ctrlWrapper(facebookSignup),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
  userDelete: ctrlWrapper(userDelete),
  refresh: ctrlWrapper(refresh),
};
