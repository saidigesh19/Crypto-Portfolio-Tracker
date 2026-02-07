import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../api/config";

const useSocketPortfolio = ({ userId, onUpdate }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || typeof onUpdate !== "function") return;

    socketRef.current = io(API_BASE_URL);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", userId);
    });

    socketRef.current.on("portfolioUpdate", (payload) => {
      if (!payload) return;
      const nowISO = new Date().toISOString();
      onUpdate({ payload, nowISO });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId, onUpdate]);
};

export default useSocketPortfolio;
