import mysql from "mysql";
import { config } from "dotenv";

config();

const connection = mysql.createConnection(process.env.DATABASE_URL || "");

class Database {
	private retryTime = 2000;

	public handleDisconnect(): void {
		connection.connect((error) => {
			if (error) {
				console.error("Error connecting to the database:", error);
				setTimeout(() => this.handleDisconnect(), this.retryTime);
				this.retryTime *= 2;
			} else {
				console.log("Connected to the MySQL database.");
				this.retryTime = 2000;
			}
		});

		connection.on("error", (error) => {
			if (error.code === "PROTOCOL_CONNECTION_LOST") {
				this.handleDisconnect();
			} else {
				throw error;
			}
		});
	}
}

const db = new Database();
db.handleDisconnect();

export default connection;
