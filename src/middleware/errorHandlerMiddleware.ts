import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const errorHandlerMiddleware = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error("Unhandled error", { error });
	res
		.status(500)
		.json({
			message: "Internal server error from errorHandlerMiddleware",
			error,
		});
};

export default errorHandlerMiddleware;
