import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { Task } from "../models/task.js";

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;

  const result = await Task.find({ owner });
  res.json(result);
};

const createTask = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Task.create({ ...req.body, owner });
  res.status(201).json({
    message: "Add Succes",
  });
};

const deleteTask = async (req, res, next) => {
  const { id: taskId } = req.params;
  const { _id: owner } = req.user;
  const task = await Task.findOne({ _id: taskId, owner });
  if (!task) {
    return next(HttpError(404));
  }
  const deleteTask = await task.deleteOne();
  if (deleteTask.deletedCount !== 0) {
    res.json(task);
  }
};

export default {
  getAll: ctrlWrapper(getAll),
  createTask: ctrlWrapper(createTask),
  deleteTask: ctrlWrapper(deleteTask),
};
