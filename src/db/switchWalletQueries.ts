import db from "../config/data_base";

const FIND_MAIN_WALLET_QUERY =
	"SELECT id FROM users_wallets WHERE user_id = ? AND is_main_wallet = true";
const FIND_SECOND_WALLET_QUERY =
	"SELECT id FROM users_wallets WHERE user_id = ? AND is_second_wallet = true";
const UPDATE_MAIN_WALLET_QUERY =
	"UPDATE users_wallets SET is_main_wallet = false, is_second_wallet = true WHERE id = ?";
const UPDATE_SECOND_WALLET_QUERY =
	"UPDATE users_wallets SET is_main_wallet = true, is_second_wallet = false WHERE id = ?";

export const findMainWallet = async (userId: string) => {
	return await db.execute(FIND_MAIN_WALLET_QUERY, [userId]);
};

export const findSecondWallet = async (userId: string) => {
	return await db.execute(FIND_SECOND_WALLET_QUERY, [userId]);
};

export const updateMainWallet = async (walletId: number) => {
	return await db.execute(UPDATE_MAIN_WALLET_QUERY, [walletId]);
};

export const updateSecondWallet = async (walletId: number) => {
	return await db.execute(UPDATE_SECOND_WALLET_QUERY, [walletId]);
};
