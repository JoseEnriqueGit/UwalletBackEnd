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

		// Get the current balance of the user
		const [balanceRows] = (await connection.query(
			"SELECT SUM(CASE WHEN transfer_type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN transfer_type = 'spent' THEN amount ELSE 0 END) AS balance FROM user_history WHERE user_id = ?",
			[req.body.user_id]
		)) as RowDataPacket[];

		// Extract the balance from the query result
		const currentBalance = balanceRows[0]?.balance || 0;

		// Insert the record in user_history with the calculated previous_balance
		const [rows] = await connection.query(
			"INSERT INTO user_history (user_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				req.body.user_id,
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
