import express from "express";

import { isAuthenticated } from "../../middlewares/index.js";
import ctrl from "../../controllers/taskController.js";

const router = express.Router();

router.get("/", isAuthenticated, ctrl.getAll);
router.post("/", isAuthenticated, ctrl.createTask);
router.delete("/:id", isAuthenticated, ctrl.deleteTask);

export default router;
