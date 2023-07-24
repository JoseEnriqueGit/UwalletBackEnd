// Lib
import express from "express";
import cors from "cors";
import { config } from "dotenv";
// Routes
import { user_routes, user_history_routes } from "./routes";

config();

const server = express();
server.use(cors(), express.json());

// userRoutes
server.use(user_routes);
// userHistoryRoutes
server.use(user_history_routes);

server.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});


var myHeaders = new Headers();
myHeaders.append("apikey", "zMxsDr5iOs3MUYbZdHyWOBfPhfpmoYEu");

var requestOptions: {
	method: string;
	redirect: RequestRedirect;
	headers: Headers;
} = {
method: 'GET',
redirect: 'follow',
headers: myHeaders
};


fetch("https://api.apilayer.com/exchangerates_data/convert?to={to}&from={from}&amount={amount}", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));