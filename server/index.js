
// Main server entry point for Crypto Portfolio Tracker backend
import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import { holdingsRouter, injectIO } from "./router/holdingsRouter.js";
import authRouter from "./router/auth.js";
import setupSocket from "./socket.js";
import startPriceJob from "./priceJob.js";
import portfolio from "./router/portfolioRouter.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();
// Create HTTP server and Socket.IO instance FIRST
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Enable CORS for all routes (allow local dev client)
app.use(cors({ origin: '*' }));
// Parse JSON request bodies
app.use(express.json());
// API routes
// Inject io into holding routes for real-time updates
app.use("/api/holdings", injectIO(io), holdingsRouter);
app.use("/api/portfolio", portfolio);
app.use("/api", authRouter);

// Set up real-time socket events
setupSocket(io);
// Start background price update job
startPriceJob(io);

// Start the server
server.listen(PORT, () => {
    console.log(`The server is running at ${PORT}`);
});