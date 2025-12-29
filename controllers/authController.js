import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { ctrlWrapper, HttpError, sendEmail } from "../helpers/index.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const verificationCode = nanoid();
  const hashPassword = await bcrypt.hash(password, 14);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${env.baseUrl}/api/auth/verify/${verificationCode}" >Verify Email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    message: "User registered successfully",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404);
  }

  const verificationUpdate = await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  res.json({
    message: "Email has been verified successfully",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(401, "Email already verified");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${env.baseUrl}/api/auth/verify/${user.verificationCode}" >Verify Email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent successfully",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
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

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: "23h",
  });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
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
  const user = await User.findByIdAndUpdate(_id, { token: null });

  res.json({
    message: "Logout successful",
  });
};

const googleSignup = async (req, res, next) => {
  const { _id } = req.user;
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: "23h",
  });
  const user = await User.findByIdAndUpdate(_id, { token });
  res.redirect(`${env.frontendUrl}/google?token=${token}`);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  googleSignup: ctrlWrapper(googleSignup),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
