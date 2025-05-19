// backend/src/infrastructure/websocket/socket.ts
import { Server as SocketIOServer } from "socket.io";

export const initializeSocket = (io: SocketIOServer): void => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Enviar un mensaje de bienvenida
    socket.emit("message", "Conexión establecida");

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};

export const emitUpdate = (io: SocketIOServer, data: any) => {
  io.emit("update", data);
};
