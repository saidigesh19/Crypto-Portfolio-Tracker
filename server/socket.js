import { computeAndEmitUser } from "./service/portfolioCompute.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Sets up socket event listeners
const setupSocket = (io) => {
    io.on("connection", socket => {
        // Listen for join event with userId and token
        socket.on("join", async ({ userId, token }) => {
            if (!userId || !token) return;
            try {
                // Verify JWT token for authentication
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded.id !== userId) {
                    socket.emit("error", "Invalid token for user.");
                    return;
                }
                // Join user-specific room
                socket.join(userId);
                // Immediately compute and emit latest portfolio for this user
                await computeAndEmitUser(io, userId);
            } catch (err) {
                socket.emit("error", "Authentication failed.");
            }
        });
    });
};

export default setupSocket;