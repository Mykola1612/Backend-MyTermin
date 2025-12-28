import express from "express";

import ctrl from "../../controllers/usersController.js";

const router = express.Router();

router.patch("/update", ctrl.updateUser);

export default router;
