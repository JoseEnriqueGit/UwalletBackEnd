import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const notFound = (req: Request, res: Response, _next: NextFunction) => {
	logger.error(`I’m sorry, the requested route ${req.url} does not exist.`);
	res
		.status(404)
		.json(`I’m sorry, the requested route ${req.url} does not exist.`);
};

export default notFound;
