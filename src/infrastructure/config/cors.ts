import { CorsOptions } from "cors";

const whiteList = [process.env.FRONTEND_URL];

// Permitir localhost:4000 y cualquier origen en modo desarrollo o con --api
if (process.env.NODE_ENV === "development" || process.argv.includes("--api")) {
  whiteList.push("http://localhost:4000"); // Permitir solicitudes desde el mismo servidor
  whiteList.push("http://localhost:5173"); 
  whiteList.push(undefined); // Para herramientas como Postman
}

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Permitir si el origen es undefined (Postman o mismo servidor) o está en la lista blanca
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Origen no permitido por CORS:", origin);
      callback(new Error("Error de CORS"));
    }
    console.log("Solicitando desde origen:", origin);
  },
  credentials: true, // Permitir el uso de cookies
};
