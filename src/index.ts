// Lib
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import https from "https";
import { options } from "./config/ssl_config";
// Routes
import userRoutes from './routes/user_routes';

config();

const app = express();
app.use(cors(), express.json());

app.use(userRoutes);

const server = https.createServer(options, app);


server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});