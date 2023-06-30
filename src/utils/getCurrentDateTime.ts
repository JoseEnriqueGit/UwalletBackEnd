import * as moment from "moment-timezone";

function getCurrentDateTimeInDominicanRepublic(): string {
	const currentDateTime = moment
		.tz("America/Santo_Domingo")
		.format("YYYY-MM-DD HH:mm:ss");
	return currentDateTime;
}

export default getCurrentDateTimeInDominicanRepublic;
