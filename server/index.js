import  express from 'express';
import http from "http"
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import holdingsRouter from "./router/holdingsRouter.js";
import setupSocket from "./socket.js";
import startPriceJob from "./priceJob.js";
dotenv.config()

connectDB();

const PORT = process.env.PORT || 5000 ;

const app = express();
app.use(express.json());
app.use("/api/holdings", holdingsRouter);

const server = http.createServer(app);;
const io = new Server(server, {cors:{origin: "*"}});

setupSocket(io);
startPriceJob(io);
server.listen(PORT, ()=>{
    console.log(`The server is running at ${PORT}`);
})