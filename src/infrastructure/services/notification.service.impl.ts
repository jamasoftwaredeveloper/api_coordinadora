import nodemailer from "nodemailer";
import {
  NotificationService,
  NotificationPayload,
} from "../../interfaces/services/notification.service.interface";

export class NotificationServiceImpl implements NotificationService {
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    // En una implementación real, esto se conectaría a un servicio de email como SendGrid, Mailgun, etc.
    const user = process.env.MAILTRAP_USER?.trim();
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
      console.log("Correo enviado correctamente");
      return true;
    } catch (error) {
      console.error("Error al enviar el correo:", error.message);
      console.error("Error al enviar el correo:", error);
      return false;
    }
  }
}
