import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { User } from "../models/user.js";

const updateUser = async (req, res) => {};

export default {
  updateUser: ctrlWrapper(updateUser),
};
