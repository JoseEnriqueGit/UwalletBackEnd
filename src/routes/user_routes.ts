import { Router } from "express";

import { getAllUsers, getUserById, createUser } from "../controllers/user_controller";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);

export default router;