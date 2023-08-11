import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import db from "../../config/data_base";
import logger from "../../config/logger";

// Parametrized query with placeholders
const GET_WALLETS_INFO_QUERY = `
    SELECT
        uw.id,
        uw.currency,
        uw.is_main_wallet,
        uw.is_second_wallet,
        SUM(CASE WHEN uh.transfer_type = 'income' THEN uh.amount ELSE 0 END) - SUM(CASE WHEN uh.transfer_type = 'spent' THEN uh.amount ELSE 0 END) AS balance
    FROM users_wallets uw
    LEFT JOIN user_history uh ON uw.user_id = uh.user_id AND uw.id = uh.wallet_id
    WHERE uw.user_id = ?
    GROUP BY uw.id
`;

interface WalletRow extends RowDataPacket {
	id: number;
	currency: string;
	is_main_wallet: boolean;
	is_second_wallet: boolean;
	balance: number;
}

interface WalletResponse {
	balance: number;
	currency: string;
	hasSecondWallet: boolean;
	secondWalletCurrency: string;
}

export const getUserWalletInformation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await db.transaction(async (connection) => {
			const [walletsRows] = await connection.execute<WalletRow[]>(
				GET_WALLETS_INFO_QUERY,
				[req.params.id]
			);

			if (!walletsRows || walletsRows.length === 0) {
				return { message: "No wallets found" };
			}

			const mainWallet = walletsRows.find(
				(walletRow) => walletRow.is_main_wallet
			);
			const secondWallet = walletsRows.find(
				(walletRow) => walletRow.is_second_wallet
			);

			const response: WalletResponse = {
				balance: mainWallet?.balance || 0,
				currency: mainWallet?.currency || "",
				hasSecondWallet: !!secondWallet,
				secondWalletCurrency: secondWallet?.currency || "",
			};

			return response;
		});

		if (result) {
			res.json(result);
		} else {
			res.status(204).json({ message: "No wallets found" });
		}
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			logger.error("Error retrieving user wallet information", { error });
		}
		res.status(500).json({
			message: "An error occurred while retrieving user wallet information",
		});
	}
};
