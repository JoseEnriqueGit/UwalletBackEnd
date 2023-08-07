import { Request, Response } from "express";
import { OkPacket } from "mysql2"; // Replace with your actual import
import db from "../config/data_base";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";


export const createNewWallet = async (req: Request, res: Response) => {
	const user_id = req.body.user_id; // Assuming you get the user ID from the request params
	const currency = req.body.currency; // Get the currency from the request body
	const amount = req.body.amount;
	const is_main_wallet = req.body.is_main_wallet | 0; // Get the is_main_wallet from the request body
	const is_second_wallet = req.body.is_second_wallet | 0; // Get the is_second_wallet from the request body

	if (is_main_wallet && is_second_wallet) {
		return res
			.status(400)
			.json({ error: "Cannot be both main and second wallet" });
	}

	try {
		const connection = await db.getConnection();
		await connection.beginTransaction();

		// Insert new wallet into users_wallets
		const [insertResult] = await connection.query(
			"INSERT INTO users_wallets (user_id, currency, is_main_wallet, is_second_wallet) VALUES (?, ?, ?, ?)",
			[user_id, currency, is_main_wallet, is_second_wallet]
		);

		const wallet_id = (insertResult as OkPacket).insertId;

		// Insert record into user_history
		await connection.query(
			"INSERT INTO user_history (user_id, wallet_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, 'income', ?, 0, 'New wallet', 'UNDEFINED')",
			[user_id, wallet_id, getCurrentDateTimeInDominicanRepublic(), amount]
		);

		await connection.commit();
		connection.release();

		res.json({ message: "New wallet created successfully", wallet_id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

