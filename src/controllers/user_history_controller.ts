import { Request, Response } from "express";
import db from "../config/data_base";
import { RowDataPacket } from "mysql2";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";

export const getAllUserHistory = async (_req: Request, res: Response) => {
	try {
		const rows = await db.query("SELECT * FROM user_history");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addRecordToHistory = async (req: Request, res: Response) => {
	try {
		const mainWalletRow = (await db.query(
			"SELECT id FROM users_wallets WHERE user_id = ? AND is_main_wallet = ?",
			[req.body.user_id, true]
		)) as RowDataPacket[];

		if (!Array.isArray(mainWalletRow) || mainWalletRow.length === 0) {
			res.status(404).json({ error: "Main wallet not found" });
			return;
		}

		const mainWalletId = mainWalletRow[0]?.id;

		const balanceRows = (await db.query(
			"SELECT SUM(CASE WHEN transfer_type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN transfer_type = 'spent' THEN amount ELSE 0 END) AS balance FROM user_history WHERE user_id = ? AND wallet_id = ?",
			[req.body.user_id, mainWalletId]
		)) as RowDataPacket[];

		const currentBalance = balanceRows[0]?.balance || 0;

		if (
			req.body.transfer_type === "spent" &&
			req.body.amount > currentBalance
		) {
			res.status(400).json({ error: "Insufficient funds" });
			return;
		}

		const rows = await db.query(
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

		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
