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
    const userDateId = await jwt.verify(refreshToken, env.jwtRefreshSecret);
    if (!userDateId) {
      throw HttpError(401, "Token invalid");
    }
    const refreshTokenDate = await Token.findOne({ user: userDateId.id });
    if (!refreshTokenDate) {
      throw HttpError(404);
    }
    const hashRefreshToken = await bcrypt.compare(
      refreshToken,
      refreshTokenDate.refreshToken
    );
    if (!hashRefreshToken) {
      throw HttpError(404);
    }

    const userDate = await jwt.verify(refreshToken, env.jwtRefreshSecret);
    return userDate;
  } catch (error) {
    return null;
  }
};

const findRefreshToken = async (refreshToken) => {
  try {
    const userDateId = await jwt.verify(refreshToken, env.jwtRefreshSecret);
    if (!userDateId) {
      throw HttpError(401, "Token invalid");
    }
    const refreshTokenDate = await Token.findOne({ user: userDateId.id });
    if (!refreshTokenDate) {
      throw HttpError(404);
    }
    const userDate = await Token.findOne({
      refreshToken: refreshTokenDate.refreshToken,
    });
    if (!userDate) {
      throw HttpError(404);
    }
    return userDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteToken = async (refreshToken) => {
  if (!refreshToken) {
    throw HttpError(401);
  }
  await Token.deleteOne(refreshToken);
};

export default {
  saveToken,
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  findRefreshToken,
  deleteToken,
};
