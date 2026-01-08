import express from "express";

import { isAuthenticated, validateBody } from "../../middlewares/index.js";
import ctrl from "../../controllers/taskController.js";
import { schemas } from "../../models/task.js";

const router = express.Router();

router.get("/", isAuthenticated, ctrl.getAll);
router.post(
  "/",
  isAuthenticated,
  validateBody(schemas.joiAddTaskSchema),
  ctrl.createTask
);
router.delete("/:id", isAuthenticated, ctrl.deleteTask);
router.patch(
  "/:id",
  isAuthenticated,
  validateBody(schemas.joiUpdateTaskSchema),
  ctrl.updateTask
);

export default router;
