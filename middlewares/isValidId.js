import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/index.js";

export const isValidId = (req, res, next) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {
    next(HttpError(400, `Id "${_id}" is not valid`));
  }
  next();
};
