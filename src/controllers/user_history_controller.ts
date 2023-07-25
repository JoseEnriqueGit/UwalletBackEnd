import { Request, Response } from "express";
import db from "../config/data_base";
import { RowDataPacket } from "mysql2";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";

export const getAllUserHistory = async (_req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query("SELECT * FROM user_history");
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addRecordToHistory = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();

		// Get the main wallet ID of the user from users_wallets table
		const [mainWalletRow] = (await connection.query(
			"SELECT id FROM users_wallets WHERE user_id = ? AND is_main_wallet = ?",
			[req.body.user_id, true]
		)) as RowDataPacket[];

		if (!Array.isArray(mainWalletRow) || mainWalletRow.length === 0) {
			connection.release();
			res.status(404).json({ error: "Main wallet not found" });
			return;
		}

		const mainWalletId = mainWalletRow[0].id;

		// Get the current balance of the user
		const [balanceRows] = (await connection.query(
			"SELECT SUM(CASE WHEN transfer_type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN transfer_type = 'spent' THEN amount ELSE 0 END) AS balance FROM user_history WHERE user_id = ? AND wallet_id = ?",
			[req.body.user_id, mainWalletId]
		)) as RowDataPacket[];

		// Extract the balance from the query result
		const currentBalance = balanceRows[0]?.balance || 0;

		// Check if the transfer_type is 'spent' and if the amount exceeds the current balance
		if (
			req.body.transfer_type === "spent" &&
			req.body.amount > currentBalance
		) {
			connection.release();
			res.status(400).json({ error: "Insufficient funds" });
			return;
		}

		// Insert the record in user_history with the calculated previous_balance and wallet_id
		const [rows] = await connection.query(
			"INSERT INTO user_history (user_id, wallet_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, 'UNDEFINED'))",
			[
				req.body.user_id,
				mainWalletId,
				getCurrentDateTimeInDominicanRepublic(),
				req.body.transfer_type,
				req.body.amount,
				currentBalance,
				req.body.description,
				req.body.expenses_type,
			]
		);

		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
