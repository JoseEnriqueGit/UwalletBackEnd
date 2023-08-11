import { Router } from "express";

import {
	createNewWallet,
} from "../controllers/user_wallets_controller";

const router = Router();

router.post("/v1/wallets", createNewWallet);

export default router;
