import { Request, Response } from "express";
import db from "../../config/data_base";
import logger from "../../config/logger";
import { BalanceRowSchema } from "../../models";
import { balanceInfo } from "../../db";

interface WalletResponse {
	balance: number;
	currency: string;
	hasSecondWallet: boolean;
	secondWalletCurrency: string;
}

export const getUserWalletInformation = async (
	req: Request,
	res: Response,
) => {
	try {
		const result = await db.transaction(async (connection) => {
			const walletsRows = await balanceInfo(connection, req.params.id);

			if (!walletsRows || walletsRows.length === 0) {
				return { message: "No wallets found" };
			}

			// Convert types of fields before validating with zod
			const validatedWalletsRows = walletsRows.map((row) => {
				// Convert is_main_wallet and is_second_wallet fields to boolean
				row.is_main_wallet = !!row.is_main_wallet;
				row.is_second_wallet = !!row.is_second_wallet;

				// Convert balance field to number
				row.balance = Number(row.balance);

				return BalanceRowSchema.parse(row);
			});

			const mainWallet = validatedWalletsRows.find(
				(walletRow) => walletRow.is_main_wallet
			);
			const secondWallet = validatedWalletsRows.find(
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
		logger.error("Error retrieving user wallet information", { error });

		res.status(500).json({
			message: "An error occurred while retrieving user wallet information",
		});
	}
};
