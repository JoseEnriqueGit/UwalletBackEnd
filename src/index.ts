// Lib
import express from "express";
import cors from "cors";
import { config } from "dotenv";
// Routes
import {
	user_routes,
	user_history_routes,
	user_wallets_routes,
} from "./routes";
import { errorHandlerMiddleware, notFound } from "./middleware";

config();

const server = express();
server.use(cors(), express.json());

// userRoutes
server.use(user_routes);
// userHistoryRoutes
server.use(user_history_routes);
// userWalletsRoutes
server.use(user_wallets_routes);

// middleware
server.use(errorHandlerMiddleware);
server.use(notFound);


server.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});
