// Lib
import express from "express";
import cors from "cors";
import { config } from "dotenv";
// Routes
import userRoutes from './routes/user_routes';

config();

const server = express();
server.use(cors(), express.json());

server.use(userRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
