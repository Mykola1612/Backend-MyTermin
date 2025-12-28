import { env } from "../config/env.js";
import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 14);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    massege: "User added successfully",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
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
  const user = await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    massege: "Logout success",
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
};
