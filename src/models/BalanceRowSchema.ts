import * as z from "zod";

// Defining a schema for the data returned from the database
const BalanceRowSchema = z.object({
	id: z.number(),
	currency: z.string(),
	is_main_wallet: z.number().transform((value) => !!value),
	is_second_wallet: z.number().transform((value) => !!value),
	balance: z.string().transform(parseFloat),
});

export default BalanceRowSchema;
