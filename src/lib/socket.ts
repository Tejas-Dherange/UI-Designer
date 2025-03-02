
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
      });

      socket.on("send-message", (message: { roomId: string; content: string; userId: string; username: string }) => {
        io?.to(message.roomId).emit("receive-message", message);
      });

      socket.on("leave-room", (roomId: string) => {
        socket.leave(roomId);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return io;
};
