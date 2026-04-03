import { Server } from "socket.io";
import http from "http";

let io;
const userSocketMap = {};

export const createSocketServer = (app) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    // Add user
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // 🔥 Send online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];

      // 🔥 Update online users after disconnect
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return server;
};

// get socket id for messaging
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io };