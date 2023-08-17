import { Request, Response } from "express";
import db from "../config/data_base";
import { ResultSetHeader } from "mysql2";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";

export const createNewWallet = async (req: Request, res: Response) => {
	const user_id = req.body.user_id;
	const currency = req.body.currency;
	const amount = req.body.amount;
	const is_main_wallet = req.body.is_main_wallet | 0;
	const is_second_wallet = req.body.is_second_wallet | 0;

	if (is_main_wallet && is_second_wallet) {
		return res
			.status(400)
			.json({ error: "Cannot be both main and second wallet" });
	}

	try {
		await db.transaction(async () => {
			// Insert new wallet into users_wallets
			const insertResult = await db.execute(
				"INSERT INTO users_wallets (user_id, currency, is_main_wallet, is_second_wallet) VALUES (?, ?, ?, ?)",
				[user_id, currency, is_main_wallet, is_second_wallet]
			);

			const wallet_id = (insertResult.insertId);

			// Insert record into user_history
			await db.execute(
				"INSERT INTO user_history (user_id, wallet_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, 'income', ?, 0, 'New wallet', 'UNDEFINED')",
				[user_id, wallet_id, getCurrentDateTimeInDominicanRepublic(), amount]
			);

			res.json({ message: "New wallet created successfully", wallet_id });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
