import nodemailer from "nodemailer";
import {
  NotificationService,
  NotificationPayload,
} from "../../interfaces/services/notification.service.interface";

export class NotificationServiceImpl implements NotificationService {
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    // En una implementación real, esto se conectaría a un servicio de email como SendGrid, Mailgun, etc.
    try {
      // Configuración del transporter
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: parseInt(process.env.MAILTRAP_PORT || "2525", 10),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
        secure: false, // Set to true if using port 465
      } as nodemailer.TransportOptions);

      // Opciones del correo
      const mailOptions = {
        from: process.env.MAILTRAP_EMAIL,
        to: payload.to,
        subject: payload.subject,
        text: payload.content,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log("Correo enviado correctamente");
      return true;
    } catch (error) {
      console.error("Error al enviar el correo:", error.message);
      return false;
    }
  }
}
