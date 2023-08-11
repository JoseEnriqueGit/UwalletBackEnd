import { Router } from "express";

import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
} from "../controllers/user_controller";

import { getUserWalletInformation, switchWallet } from "../controllers";

const router = Router();

router.get("/v1/users", getAllUsers);
router.get("/v1/users/:id", getUserById);
router.post("/v1/users", createUser);
router.delete("/v1/users/:id", deleteUser);

router.get("/v1/users/:id/wallet-information", getUserWalletInformation);

router.patch("/v1/users/switchWallet/:user_id", switchWallet);

router.get("/v1/users//wallet-information", (req, res) => {
	res.status(400).json({ error: "Invalid user ID" });
});

export default router;
