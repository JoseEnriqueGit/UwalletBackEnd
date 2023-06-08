import { Request, Response } from "express";
import db from "../config/data_base";
import { log } from "console";

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
	try {
		const userId = req.body.data.id;
		const email = req.body.data.email_addresses[0].email_address;
		const username = req.body.data.username;

		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"INSERT INTO users (id, username, email) VALUES (?, ?, ?)",
			[userId, username, email]
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

export const login = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE email = ? AND password = ?",
			[req.body.email, req.body.password]
		);
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

export const getUserByEmailAndPassword = async (
	req: Request,
	res: Response
) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE email = ? AND password = ?",
			[req.params.email, req.params.password]
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

export const getUserByNameAndPassword = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM users WHERE name = ? AND password = ?",
			[req.params.name, req.params.password]
		);
		connection.release();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
