import { Router } from "express";

import {
	getAllUsers,
	getUserById,
	createUser,
  getUserBalance,
	deleteUser,
} from "../controllers/user_controller";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.get("/users/balance/:id", getUserBalance);
router.delete("/users/:id", deleteUser);

export default router;
