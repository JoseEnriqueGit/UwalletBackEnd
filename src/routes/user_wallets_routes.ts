import { Router } from "express";

import {
	createNewWallet,
} from "../controllers/user_wallets_controller";

const router = Router();

router.post("/wallets", createNewWallet);

export default router;
