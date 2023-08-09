import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
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
	const connection = await db.getConnection();

	try {
		await connection.beginTransaction();

		// Find the main wallet ID for the user
		const [mainWalletRows] = await connection.execute<RowDataPacket[]>(
			FIND_MAIN_WALLET_QUERY,
			[user_id]
		);

		// Find the second wallet ID for the user
		const [secondWalletRows] = await connection.execute<RowDataPacket[]>(
			FIND_SECOND_WALLET_QUERY,
			[user_id]
		);

		const mainWalletId = mainWalletRows[0]?.id;
		const secondWalletId = secondWalletRows[0]?.id;

		if (mainWalletId && secondWalletId) {
			// Update flags for the main wallet and the second wallet
			await connection.execute(UPDATE_MAIN_WALLET_QUERY, [mainWalletId]);
			await connection.execute(UPDATE_SECOND_WALLET_QUERY, [secondWalletId]);

			await connection.commit();
			res.json({ message: "Wallets switched successfully" });
		} else {
			res.status(400).json({ error: "Main and second wallets not found" });
		}
	} catch (error) {
		console.error(error);
		await connection.rollback();
		res.status(500).json({ error: "Internal server error" });
	} finally {
		connection.release();
	}
};
