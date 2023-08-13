import { Request, Response } from "express";
import db from "../../config/data_base";

import {
	findMainWallet,
	findSecondWallet,
	updateMainWallet,
	updateSecondWallet,
} from "../../db";

export const switchWallet = async (req: Request, res: Response) => {
	const user_id = req.params.user_id;

	try {
		const mainWalletRows = await findMainWallet(user_id);
		const secondWalletRows = await findSecondWallet(user_id);

		const mainWalletId = mainWalletRows[0]?.id;
		const secondWalletId = secondWalletRows[0]?.id;

		if (mainWalletId && secondWalletId) {
			await db.transaction(async () => {
				await updateMainWallet(mainWalletId);
				await updateSecondWallet(secondWalletId);
			});

			res.json({ isSwitched: true, message: "Wallets switched successfully" });
		} else {
			res.status(400).json({ error: "Main and second wallets not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
