import { Request, Response } from "express";
import db from "../config/data_base";
// Utils
import getCurrentDateTimeInDominicanRepublic from "../utils/getCurrentDateTime";

export const getAllUsers = async (_req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query("SELECT * FROM users");
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
			req.params.id,
		]);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	const connection = await db.getConnection();
	try {
		const user_id = req.body.data.id;
		const email = req.body.data.email_addresses[0].email_address;
		const username = req.body.data.username;

		// Start a transaction
		await connection.beginTransaction();

		// Insert the user in the users table
		let [rows] = await connection.query(
			"INSERT INTO users (id, username, email) VALUES (?, ?, ?)",
			[user_id, username, email]
		);

		// Start the user history with a 0 balance
		await connection.query(
			"INSERT INTO user_history (user_id, datetime_utc, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				user_id,
				getCurrentDateTimeInDominicanRepublic(),
				"income",
				0,
				0,
				"Start using",
				"UNDEFINED",
			]
		);

		// Commit the transaction
		await connection.commit();

		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);

		// Rollback the transaction in case of an error
		await connection.rollback();

		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserBalance = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT SUM(CASE WHEN transfer_type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN transfer_type = 'spent' THEN amount ELSE 0 END) AS balance FROM user_history WHERE user_id = ?",
			[req.params.id]
		);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
			[req.body.name, req.body.email, req.body.password, req.params.id]
		);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const connection = await db.getConnection();
	try {
		// Start a transaction
		await connection.beginTransaction();

		// Delete records from the user_history table
		await connection.query("DELETE FROM user_history WHERE user_id = ?", [
			req.params.id,
		]);

		// Delete records from the user_wishes table
		await connection.query("DELETE FROM user_wishes WHERE user_id = ?", [
			req.params.id,
		]);

		// Delete user from the users table
		const [rows] = await connection.query("DELETE FROM users WHERE id = ?", [
			req.params.id,
		]);

		// Commit the transaction
		await connection.commit();

		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);

		// Rollback the transaction in case of an error
		await connection.rollback();

		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserByEmail = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE email = ?",
			[req.params.email]
		);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserByName = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE name = ?",
			[req.params.name]
		);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
