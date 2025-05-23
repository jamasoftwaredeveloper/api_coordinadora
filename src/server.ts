import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import colors from "colors";

// Importar rutas y configuraciones
import authRouter from "./infrastructure/web/routes/auth";
import shipmentRouter from "./infrastructure/web/routes/shipment";
import { swaggerDocs } from "./swagger";
import { corsConfig } from "./infrastructure/config/cors";
import { initializeSocket } from "./infrastructure/websocket/socket";

// Crear la aplicación de Express
const app = express();

// Crear el servidor HTTP y el servidor de Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

// Iniciar Socket.IO
initializeSocket(io);

// Configuración del servidor
const port = parseInt(process.env.PORT || "4000", 10);
swaggerDocs(app, port);
app.use(cors(corsConfig));
app.use(express.json());

// Rutas
app.use("/", authRouter);
app.use("/", shipmentRouter);

export { server, io };
