import { Router } from "express";

import {
	getAllUserHistory,
	addRecordToHistory,
} from "../controllers/user_history_controller";

const router = Router();

router.get("/v1/user-history", getAllUserHistory);
router.post("/v1/user-history", addRecordToHistory);

export default router;
