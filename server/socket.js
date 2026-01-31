const setupSocket = (io)=> {
    io.on("connection", socket => {
        socket.on("join", userId=> {
            socket.join(userId);
        });
    });
};

export default setupSocket;