import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import db from "../../config/data_base";

export const getUserWalletInformation = async (req: Request, res: Response) => {
	try {
		const connection = await db.getConnection();

		// Get the user's wallets info from users_wallets table
		const [walletsRows] = await connection.query(
			"SELECT id, currency, is_main_wallet, is_second_wallet FROM users_wallets WHERE user_id = ?",
			[req.params.id]
		);

		if (Array.isArray(walletsRows) && walletsRows.length > 0) {
			let mainWalletBalance = 0;
			let hasSecondWallet = false;
			let secondWalletCurrency = "";

			for (const walletRow of walletsRows as RowDataPacket[]) {
				if (walletRow.is_main_wallet) {
					const mainWalletId = walletRow.id;
					const [mainWalletRows] = await connection.query<RowDataPacket[]>(
						"SELECT SUM(CASE WHEN transfer_type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN transfer_type = 'spent' THEN amount ELSE 0 END) AS balance FROM user_history WHERE user_id = ? AND wallet_id = ?",
						[req.params.id, mainWalletId]
					);
					mainWalletBalance = mainWalletRows[0]?.balance || 0;
				}

				if (walletRow.is_second_wallet) {
					hasSecondWallet = true;
					secondWalletCurrency = walletRow.currency;
				}
			}

			connection.release();

			if (mainWalletBalance !== undefined) {
				const response: {
					balance: number;
					hasSecondWallet: boolean;
					secondWalletCurrency: string;
				} = {
					balance: mainWalletBalance,
					hasSecondWallet: hasSecondWallet,
					secondWalletCurrency: secondWalletCurrency,
				};
				res.json(response);
			} else {
				res.status(404).json({ error: "Balance not found" });
			}
		} else {
			connection.release();
			res.status(404).json({ error: "Wallets not found" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal server error" });
	}
};
