import { Request, Response } from "express";
import db from "../../config/data_base";
import logger from "../../config/logger";
import { BalanceRowSchema } from "../../models";
import { balanceInfo } from "../../db";
import { ZodError } from "zod";

interface WalletResponse {
	balance: number;
	currency: string;
	hasSecondWallet: boolean;
	secondWalletCurrency: string;
}

export const getUserWalletInformation = async (req: Request, res: Response) => {
	try {
		const result = await db.transaction(async (connection) => {
			const balanceInfoRows = await balanceInfo(connection, req.params.id);

			if (!balanceInfoRows || balanceInfoRows.length === 0) {
				return { message: "No wallets found" };
			}

			const validatedBalanceInfoRows = balanceInfoRows.map((row) => {
				const result = BalanceRowSchema.safeParse(row);
				if (result.success) {
					return result.data;
				} else {
					const validationErrors = result.error.issues;
					logger.error("Error retrieving user wallet information", {
						validationErrors,
					});
					throw new ZodError(validationErrors);
				}
			});

			const mainWallet = validatedBalanceInfoRows.find(
				(walletRow) => walletRow.is_main_wallet
			);
			const secondWallet = validatedBalanceInfoRows.find(
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
		if (error instanceof ZodError) {
			res
				.status(400)
				.json({ message: "Validation error", errors: error.issues });
		} else {
			logger.error("Error retrieving user wallet information", { error });
			res.status(500).json({
				message: "An error occurred while retrieving user wallet information",
			});
		}
	}
};
