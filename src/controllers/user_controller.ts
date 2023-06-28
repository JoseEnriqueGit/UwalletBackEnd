import { Request, Response } from "express";
import db from "../config/data_base";

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
	/** In this code, a new user is inserted into the "users" table,
	 * and their history is initiated in the "user_history" table with an initial balance of 0. */
	try {
		const user_id = req.body.data.id;
		const email = req.body.data.email_addresses[0].email_address;
		const username = req.body.data.username;

		const connection = await db.getConnection();
		// Firt insert the user in the users table
		let [rows] = await connection.query(
			"INSERT INTO users (id, username, email) VALUES (?, ?, ?)",
			[user_id, username, email]
		);
		// Then start the user history with a 0 balance
		[rows] = await connection.query(
			"INSERT INTO user_history (user_id, creation_date, transfer_type, amount, previous_balance, description, expenses_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[user_id, "income", 0, 0, "Start using", "UNDEFINED"]
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
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query("DELETE FROM users WHERE id = ?", [
			req.params.id,
		]);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
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
