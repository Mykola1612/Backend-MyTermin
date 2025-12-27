import express from "express";

import ctrl from "../../controllers/taskController.js";
const router = express.Router();
router.get("/", ctrl.getAll);
router.post("/", ctrl.createTask);

export default router;
