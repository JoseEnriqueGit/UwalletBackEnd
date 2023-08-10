import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const notFound = (req: Request, res: Response, _next: NextFunction) => {
	logger.error(`I’m sorry, the requested route does not exist ${req.url}`);
	res
		.status(404)
		.json(`I’m sorry, the requested route does not exist ${req.url}`);
};

export default notFound;
