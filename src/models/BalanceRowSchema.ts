import * as z from "zod";

// Defining a schema for the data returned from the database
const BalanceRowSchema = z.object({
	id: z.number(),
	currency: z.string(),
	is_main_wallet: z.boolean(),
	is_second_wallet: z.boolean(),
	balance: z.number(),
});

export default BalanceRowSchema;
