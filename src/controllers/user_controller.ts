import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import db from "../config/data_base";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";

export const getAllUsers = async (_req: Request, res: Response) => {
	try {
		const rows = await db.query("SELECT * FROM users");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const rows = await db.query("SELECT * FROM users WHERE id = ?", [
			req.params.id,
		]);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const user_id = req.body.data.id;
		const email = req.body.data.email_addresses[0].email_address;
		const username = req.body.data.username;

		await db.transaction(async (conn) => {
			await conn.query(
				"INSERT INTO users (id, username, email) VALUES (?, ?, ?)",
				[user_id, username, email]
			);

			await conn.query(
				"INSERT INTO users_wallets (user_id, is_main_wallet) VALUES (?, ?)",
				[user_id, true]
			);

			const [walletRow] = (await conn.query(
				"SELECT id FROM users_wallets WHERE user_id = ? AND is_main_wallet = ?",
				[user_id, true]
			)) as RowDataPacket[];

			const wallet_id = walletRow[0]?.id;

			await conn.query(
				"INSERT INTO user_history (user_id, wallet_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
				[
					user_id,
					wallet_id,
					getCurrentDateTimeInDominicanRepublic(),
					"income",
					0,
					0,
					"Start using",
					"UNDEFINED",
				]
			);
		});

		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		await db.transaction(async (conn) => {
			await conn.query("DELETE FROM user_history WHERE user_id = ?", [
				req.params.id,
			]);
			await conn.query("DELETE FROM user_wishes WHERE user_id = ?", [
				req.params.id,
			]);
			const [deleteRows] = await conn.query("DELETE FROM users WHERE id = ?", [
				req.params.id,
			]);

			res.json(deleteRows);
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
