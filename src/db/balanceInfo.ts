import { PoolConnection } from "mysql2/promise";
import { RowDataPacket } from "mysql2";

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

export const balanceInfo = async (
	connection: PoolConnection,
	userId: string
): Promise<WalletRow[]> => {
	const [walletsRows] = await connection.execute<WalletRow[]>(
		GET_WALLETS_INFO_QUERY,
		[userId]
	);

	return walletsRows;
};
