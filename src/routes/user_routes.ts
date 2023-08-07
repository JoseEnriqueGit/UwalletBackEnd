import { Router } from "express";

import {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser,
} from "../controllers/user_controller";

import { getUserWalletInformation } from "../controllers";

const router = Router();

router.get("/v1/users", getAllUsers);
router.get("/v1/users/:id", getUserById);
router.post("/v1/users", createUser);
router.delete("/v1/users/:id", deleteUser);

router.get("/v1/users/wallet-information/:id", getUserWalletInformation);

export default router;
