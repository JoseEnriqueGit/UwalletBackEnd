import { Request, Response } from "express";
import { z } from "zod";
import db from "../../config/data_base";


const getCurrencyRatesSchema = z.object({
	user_id: z.string(),
});

export const getCurrencyRates = async (req: Request, res: Response) => {
	try {
		const { user_id } = getCurrencyRatesSchema.parse(req.params);

		const rows = await db.execute(
			`SELECT currency FROM currency_rates WHERE currency NOT IN (SELECT currency FROM users_wallets WHERE user_id = ?)`,
			[user_id]
		);

		if (!rows) {
			return res.json({ success: false ,message: "No currencies found" });
		}

		const options = rows.map((row: any) => ({
			value: row.currency,
			label: row.currency,
		}));

		res.json(options);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
