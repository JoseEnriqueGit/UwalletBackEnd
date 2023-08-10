import { createLogger, transports } from "winston";

const logger = createLogger({
	transports: [
		new transports.Console(),
		new transports.File({ filename: "error.log", level: "error" }),
	],
});

export default logger;
