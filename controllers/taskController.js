import { ctrlWrapper } from "../helpers/index.js";
import { Task } from "../models/task.js";

const getAll = async (req, res, next) => {
  const result = await Task.find();
  res.json(result);
};

const createTask = async (req, res, next) => {
  const result = await Task.create(req.body);
  res.status(201).json({
    message: "Add Succes",
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  createTask: ctrlWrapper(createTask),
};
