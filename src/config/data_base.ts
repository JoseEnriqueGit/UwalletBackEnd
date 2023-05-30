import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

class Database {
  private pool: mysql.Pool;
  
  constructor() {
    this.pool = mysql.createPool(process.env.DATABASE_URL!);
  }
  
  public getConnection(): Promise<mysql.PoolConnection> {
    return this.pool.getConnection();
  }
}

const db = new Database();

export default db;

