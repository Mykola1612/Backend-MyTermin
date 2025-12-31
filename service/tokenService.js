import { env } from "../config/env.js";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.js";

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
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const refreshTokenCreate = await Token.create({ user: userId, refreshToken });
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
    return userDate;
  } catch (error) {
    return null;
  }
};

const findRefreshToken = async (refreshToken) => {
  try {
    const userDate = await Token.findOne({ refreshToken });
    return userDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default {
  saveToken,
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  findRefreshToken,
};
