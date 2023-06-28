import { Router } from "express";

import {
	getAllUserHistory,
	addRecordToHistory,
} from "../controllers/user_history_controller";

const router = Router();

router.get("/user-history", getAllUserHistory);
router.post("/user-history", addRecordToHistory);

export default router;
