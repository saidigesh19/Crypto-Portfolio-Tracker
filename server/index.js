import  express from 'express';
import http from "http"
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import holdingsRouter from "./router/holdingsRouter.js";
import authRouter from "./router/auth.js";
import setupSocket from "./socket.js";
import startPriceJob from "./priceJob.js";
import portfolio from "./router/portfolioRouter.js";
dotenv.config()

connectDB();

const PORT = process.env.PORT || 5000 ;

const app = express();
// enable CORS for all routes (allow local dev client)
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/api/holdings", holdingsRouter);
app.use("/api/portfolio", portfolio);
app.use("/api", authRouter);

const server = http.createServer(app);;
const io = new Server(server, {cors:{origin: "*"}});

setupSocket(io);
startPriceJob(io);
server.listen(PORT, ()=>{
    console.log(`The server is running at ${PORT}`);
})