import { Request, Response } from "express";
import db from "../config/data_base";
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
		const [rows] = await connection.query(
			"INSERT INTO user_history (user_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				req.body.user_id,
				getCurrentDateTimeInDominicanRepublic(),
				req.body.transfer_type,
				req.body.amount,
				req.body.previous_balance,
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
