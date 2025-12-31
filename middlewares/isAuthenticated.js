import tokenService from "../service/tokenService.js";
import { HttpError } from "../helpers/index.js";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  if (!token) {
    next(HttpError(401));
  }
  try {
    const userDate = await tokenService.validateAccessToken(token);

    if (!userDate) {
      next(HttpError(404));
    }

    const user = await User.findById(userDate.id);

    if (!user) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};
