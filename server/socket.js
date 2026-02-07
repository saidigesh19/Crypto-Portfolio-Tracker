import { computeAndEmitUser } from "./service/portfolioCompute.js";

const setupSocket = (io)=> {
    io.on("connection", socket => {
        socket.on("join", async (userId)=> {
            if (!userId) return;
            socket.join(userId);
            // Immediately compute and emit latest portfolio for this user
            await computeAndEmitUser(io, userId);
        });
    });
};

export default setupSocket;