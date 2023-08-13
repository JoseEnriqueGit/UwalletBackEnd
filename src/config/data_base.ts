import { config } from "dotenv";
import mysql from "mysql2/promise";
import { DatabaseError, TransactionError } from "../errors";
import logger from "./logger";

config();

class Database {
	private pool: mysql.Pool;

	constructor() {
		this.pool = mysql.createPool(process.env.DATABASE_URL!);
	}

	public async query(sql: string, values?: any): Promise<any> {
		const conn = await this.pool.getConnection();
		try {
			const [rows] = await conn.query(sql, values);
			return rows;
		} catch (err) {
			const errorMessage = `Error executing query: ${sql}`;
			logger.error(errorMessage, { error: err });
			throw new DatabaseError(errorMessage, err as Error);
		} finally {
			conn.release();
		}
	}

	public async execute(sql: string, values?: any): Promise<any> {
		const conn = await this.pool.getConnection();
		try {
			const [rows] = await conn.execute(sql, values);
			return rows;
		} catch (err) {
			const errorMessage = `Error executing query: ${sql}`;
			logger.error(errorMessage, { error: err });
			throw new DatabaseError(errorMessage, err as Error);
		} finally {
			conn.release();
		}
	}

	public async transaction<T>(
		callback: (conn: mysql.PoolConnection) => Promise<T>
	): Promise<T> {
		const conn = await this.pool.getConnection();
		await conn.beginTransaction();
		try {
			const result = await callback(conn);
			await conn.commit();
			return result;
		} catch (err) {
			const errorMessage = "Transaction error";
			logger.error(errorMessage, { error: err });
			await conn.rollback();
			throw new TransactionError(errorMessage, err as Error);
		} finally {
			conn.release();
		}
	}

	public async close(): Promise<void> {
		await this.pool.end();
	}
}

const db = new Database();

export default db;
