import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { HttpError } from "../helpers/index.js";
import { User } from "../models/user.js";
import { Token } from "../models/token.js";
import emailService from "./emailService.js";
import tokenService from "./tokenService.js";

const signup = async (name, email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const verificationCode = nanoid();
  const hashPassword = await bcrypt.hash(password, 14);
  const newUser = await User.create({
    email,
    name,
    password: hashPassword,
    verificationCode,
  });
  await emailService.sendEmailVerify(email, verificationCode);
};

const verifyEmail = async (verificationCode) => {
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(404);
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });
};

const resendVerifyEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }
  await emailService.sendEmailVerify(email, user.verificationCode);
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  const resetPasswordToken = nanoid();
  await User.findByIdAndUpdate(user._id, { resetPasswordToken });
  await emailService.forgotPasswordEmail(email, resetPasswordToken);
};

const resetPassword = async (password, resetPasswordToken) => {
  const user = await User.findOne({ resetPasswordToken });
  if (!user) {
    throw HttpError(404);
  }
  const hashPassword = await bcrypt.hash(password, 14);
  await User.findByIdAndUpdate(user._id, {
    password: hashPassword,
    resetPasswordToken: null,
  });
};

const signin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  if (!user.verify) {
    throw HttpError(
      403,
      "Your email is not verified yet. Please check your inbox or request a new verification email."
    );
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const tokens = await tokenService.generateTokens({ id: user._id });
  tokenService.saveToken(user._id, tokens.refreshToken);
  return {
    refreshToken: tokens.refreshToken,
    accessToken: tokens.accessToken,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw HttpError(401);
  }
  const userDate = await tokenService.validateRefreshToken(refreshToken);
  if (!userDate) {
    throw HttpError(401);
  }
  const user = await User.findById(userDate.id);
  if (!user) {
    throw HttpError(404);
  }
  const tokens = await tokenService.generateTokens({ id: user._id });
  tokenService.saveToken(user._id, tokens.refreshToken);
  const userDateUpdate = {
    accessToken: tokens.accessToken,
    name: user.name,
    email: user.email,
  };
  return {
    refreshToken: tokens.refreshToken,
    userDateUpdate,
  };
};

const userDelete = async (_id, password) => {
  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(404);
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401);
  }
  await User.deleteOne({ _id });
};
const logout = async (_id) => {
  await Token.deleteOne({ user: _id });
};

const googleSignup = async (_id) => {
  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(404);
  }

  const tokens = await tokenService.generateTokens({ id: user._id });
  const refreshTokenDate = await Token.findOne({ user: user._id });

  if (refreshTokenDate) {
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 14);
    await Token.findOneAndUpdate(
      { user: user._id },
      {
        refreshToken: hashRefreshToken,
      }
    );
    return tokens;
  }

  const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 14);
  await Token.create({
    user: _id,
    refreshToken: hashRefreshToken,
  });
  return tokens;
};
const facebookSignup = async (_id) => {
  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(404);
  }
  const tokens = await tokenService.generateTokens({ id: user._id });
  const refreshTokenDate = await Token.findOne({ user: user._id });
  if (refreshTokenDate) {
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 14);
    await Token.findOneAndUpdate(
      { user: user._id },
      {
        refreshToken: hashRefreshToken,
      }
    );
    return tokens;
  }

  const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 14);
  await Token.create({
    user: _id,
    refreshToken: hashRefreshToken,
  });
  return tokens;
};

export default {
  signup,
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
  signin,
  userDelete,
  logout,
  googleSignup,
  facebookSignup,
  refresh,
};
