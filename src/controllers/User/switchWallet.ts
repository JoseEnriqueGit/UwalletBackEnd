import { Request, Response } from "express";
import db from "../../config/data_base";

const FIND_MAIN_WALLET_QUERY =
	"SELECT id FROM users_wallets WHERE user_id = ? AND is_main_wallet = true";
const FIND_SECOND_WALLET_QUERY =
	"SELECT id FROM users_wallets WHERE user_id = ? AND is_second_wallet = true";
const UPDATE_MAIN_WALLET_QUERY =
	"UPDATE users_wallets SET is_main_wallet = false, is_second_wallet = true WHERE id = ?";
const UPDATE_SECOND_WALLET_QUERY =
	"UPDATE users_wallets SET is_main_wallet = true, is_second_wallet = false WHERE id = ?";

export const switchWallet = async (req: Request, res: Response) => {
	const user_id = req.params.user_id;

	try {
		const mainWalletRows = await db.query(FIND_MAIN_WALLET_QUERY, [user_id]);
		const secondWalletRows = await db.query(FIND_SECOND_WALLET_QUERY, [
			user_id,
		]);

		const mainWalletId = mainWalletRows[0]?.id;
		const secondWalletId = secondWalletRows[0]?.id;

		if (mainWalletId && secondWalletId) {
			await db.transaction(async (conn) => {
				await conn.query(UPDATE_MAIN_WALLET_QUERY, [mainWalletId]);
				await conn.query(UPDATE_SECOND_WALLET_QUERY, [secondWalletId]);
			});

			res.json({ message: "Wallets switched successfully" });
		} else {
			res.status(400).json({ error: "Main and second wallets not found" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
