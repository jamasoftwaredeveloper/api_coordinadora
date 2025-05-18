import { exec } from "child_process";
import {
  NotificationService,
  NotificationPayload,
} from "../../interfaces/services/notification.service.interface";

export class NotificationServiceImpl implements NotificationService {
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    // En una implementación real, esto se conectaría a un servicio de email como SendGrid, Mailgun, etc.

    try {
      const token = `Bearer ${process.env.TOKEN_EMAIL}`;
      const body = JSON.stringify({
        from: { email: process.env.EMAIL, name: "Mailtrap Test" },
        to: [{ email: payload.to }],
        subject: payload.subject,
        text: payload.content,
        category: "Integration Test",
      });
      
      // Escapa las comillas dobles internas para que el JSON sea válido en la shell con comillas dobles
      const escapedBody = body.replace(/"/g, '\\"');
          
      const curlCommand = `curl --location --request POST "${process.env.EMAIL_API}" --header "Authorization: ${token}" --header "Content-Type: application/json" --data-raw "${escapedBody}"`;
      

      const result = await new Promise<boolean>((resolve, reject) => {
        exec(curlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error ejecutando curl: ${error.message}`);
            reject(false);
            return;
          }

          if (stderr) {
            console.error(`Error en cURL: ${stderr}`);
            reject(false);
            return;
          }

          console.log(`Respuesta de cURL: ${stdout}`);
          resolve(true);
        });
      });
      console.log("result",result);
      
      return true;
    } catch (error) {}
  }

  /* const user = process.env.MAILTRAP_USER?.trim();
    const pass = process.env.MAILTRAP_PASS?.trim();
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || "2525", 10),
      secure: false, // para puerto 2525 usualmente es false
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    try {
      // Configuración del transporter
      // Enviar el correo
      let info = await transporter.sendMail({
        from: process.env.MAILTRAP_EMAIL,
        to: payload.to,
        subject: payload.subject,
        text: payload.content,
      });
      console.log("Correo enviado correctamente" ,info);
      return true;
    } catch (error) {
      console.error("Error al enviar el correo:", error.message);
      console.error("Error al enviar el correo:", error);
      return false;
    }*/
}
