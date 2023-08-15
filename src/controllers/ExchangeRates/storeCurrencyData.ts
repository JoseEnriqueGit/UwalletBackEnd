import db from "../../config/data_base";
import fetch from "node-fetch";

const API_KEY = "zMxsDr5iOs3MUYbZdHyWOBfPhfpmoYEu";
const API_URL =
	"https://api.apilayer.com/exchangerates_data/latest?symbols=&base=USD";

interface ExchangeRatesData {
	base: string;
	date: string;
	rates: Record<string, number>;
}

async function fetchExchangeRatesData(): Promise<ExchangeRatesData> {
	const response = await fetch(API_URL, {
		method: "GET",
		headers: {
			apikey: API_KEY,
		},
	});
	return (await response.json()) as ExchangeRatesData;
}

async function insertOrUpdateExchangeRatesData(data: ExchangeRatesData) {
	const { base, date, rates } = data;

	// Check if a record with the same base value already exists
	const rows = await db.execute(
		`SELECT * FROM exchange_rates_info WHERE base = ?`,
		[base]
	);
	let infoId;
	if (rows.length > 0) {
		// Update the existing record
		infoId = rows[0].id;
		await db.execute(`UPDATE exchange_rates_info SET date = ? WHERE id = ?`, [
			date,
			infoId,
		]);
	} else {
		// Insert a new record
		const infoResult = await db.execute(
			`INSERT INTO exchange_rates_info (base, date) VALUES (?, ?)`,
			[base, date]
		);
		infoId = infoResult.insertId;
	}

	for (const [currency, rate] of Object.entries(rates)) {
		// Check if a record with the same info_id and currency values already exists
		const rows = await db.execute(
			`SELECT * FROM currency_rates WHERE info_id = ? AND currency = ?`,
			[infoId, currency]
		);
		if (rows.length > 0) {
			// Update the existing record
			await db.execute(
				`UPDATE currency_rates SET rate = ? WHERE info_id = ? AND currency = ?`,
				[rate, infoId, currency]
			);
		} else {
			// Insert a new record
			await db.execute(
				`INSERT INTO currency_rates (info_id, currency, rate) VALUES (?, ?, ?)`,
				[infoId, currency, rate]
			);
		}
	}
}

export function scheduleExchangeRatesDataInsertion(
	interval: number,
	unit: "seconds" | "minutes" | "hours" | "days" | "weeks"
) {
	const MILLISECONDS_IN_SECOND = 1000;
	const MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;
	const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
	const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
	const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY;

	let intervalInMilliseconds;
	switch (unit) {
		case "seconds":
			intervalInMilliseconds = interval * MILLISECONDS_IN_SECOND;
			break;
		case "minutes":
			intervalInMilliseconds = interval * MILLISECONDS_IN_MINUTE;
			break;
		case "hours":
			intervalInMilliseconds = interval * MILLISECONDS_IN_HOUR;
			break;
		case "days":
			intervalInMilliseconds = interval * MILLISECONDS_IN_DAY;
			break;
		case "weeks":
			intervalInMilliseconds = interval * MILLISECONDS_IN_WEEK;
			break;
		default:
			throw new Error(`Invalid unit: ${unit}`);
	}

	setInterval(async () => {
		try {
			const data = await fetchExchangeRatesData();
			await insertOrUpdateExchangeRatesData(data);
			console.log(
				`Datos insertados con éxito a las ${new Date().toISOString()}`
			);
		} catch (err) {
			console.error(err);
		}
	}, intervalInMilliseconds);
}
