import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.js";
import { HttpError } from "../helpers/HttpError.js";

const generateTokens = async (payload) => {
  const accessToken = await jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: "15m",
  });
  const refreshToken = await jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: "7d",
  });

  const tokens = { accessToken, refreshToken };
  return tokens;
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 14);
    tokenData.refreshToken = hashRefreshToken;
    return tokenData.save();
  }
  const hashRefreshToken = await bcrypt.hash(refreshToken, 14);
  const refreshTokenCreate = await Token.create({
    user: userId,
    refreshToken: hashRefreshToken,
  });
  return refreshTokenCreate;
};

const validateAccessToken = async (accessToken) => {
  try {
    const userDate = await jwt.verify(accessToken, env.jwtAccessSecret);
    return userDate;
  } catch (error) {
    return null;
  }
};

const validateRefreshToken = async (refreshToken) => {
  try {
    const userDate = await jwt.verify(refreshToken, env.jwtRefreshSecret);
    if (!userDate) {
      throw HttpError(401);
    }
    const refreshTokenDate = await Token.findOne({ user: userDate.id });
    if (!refreshTokenDate) {
      throw HttpError(404);
    }
    const hashRefreshToken = await bcrypt.compare(
      refreshToken,
      refreshTokenDate.refreshToken
    );
    if (!hashRefreshToken) {
      throw HttpError(401);
    }

    return userDate;
  } catch (error) {
    return null;
  }
};

const deleteToken = async (refreshToken) => {
  if (!refreshToken) {
    throw HttpError(401);
  }
  const userDate = await jwt.verify(refreshToken, env.jwtRefreshSecret);
  await Token.deleteOne({ user: userDate.id });
};

export default {
  saveToken,
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  deleteToken,
};
