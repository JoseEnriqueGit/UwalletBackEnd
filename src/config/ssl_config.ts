// Lib
import fs from "fs";
import { config } from "dotenv";
config();

export const options = {
  key: fs.readFileSync(process.env.KEY_PATH!),
  cert: fs.readFileSync(process.env.CERT_PATH!)
};