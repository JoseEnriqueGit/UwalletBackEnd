import db from "../../config/data_base";
import fetch from "node-fetch";
import { RequestInit } from "node-fetch";


interface ExchangeRatesData {
	base: string;
	date: string;
	rates: Record<string, number>;
}

export async function insertOrUpdateExchangeRates(interval = 604800000) {
	const myHeaders = new Headers();
	myHeaders.append("apikey", "zMxsDr5iOs3MUYbZdHyWOBfPhfpmoYEu");

	const requestOptions: RequestInit = {
		method: "GET",
		redirect: "follow",
		headers: myHeaders,
	};

	setInterval(async () => {
		const response = await fetch(
			"https://api.apilayer.com/exchangerates_data/latest?symbols=&base=USD",
			requestOptions
		);
		const result = (await response.json()) as ExchangeRatesData;
		const { base, date, rates } = result;

		const [info] = await db.execute(
			"SELECT * FROM exchange_rates_info WHERE base = ? AND date = ?",
			[base, date]
		);

		if (info) {
			await db.execute("DELETE FROM currency_rates WHERE info_id = ?", [
				info.id,
			]);
			await db.execute("UPDATE exchange_rates_info SET date = ? WHERE id = ?", [
				date,
				info.id,
			]);
		} else {
			const insertInfoResult = await db.execute(
				"INSERT INTO exchange_rates_info (base, date) VALUES (?, ?)",
				[base, date]
			);
			info.id = insertInfoResult.insertId;
		}

		for (const currency in rates) {
			await db.execute(
				"INSERT INTO currency_rates (info_id, currency, rate) VALUES (?, ?, ?)",
				[info.id, currency, rates[currency]]
			);
		}
	}, interval);
}
