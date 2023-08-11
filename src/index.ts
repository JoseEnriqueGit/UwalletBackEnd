// Lib
import cors from "cors";
import { config } from "dotenv";
import express from "express";
// Routes
import { notFound } from "./middleware";
import {
	user_history_routes,
	user_routes,
	user_wallets_routes,
} from "./routes";

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
server.use(notFound);

server.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});
