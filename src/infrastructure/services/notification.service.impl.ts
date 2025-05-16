import {
  NotificationService,
  NotificationPayload,
} from "../../interfaces/services/notification.service.interface";

export class NotificationServiceImpl implements NotificationService {
  async sendEmail(payload: NotificationPayload): Promise<boolean> {
    // En una implementación real, esto se conectaría a un servicio de email como SendGrid, Mailgun, etc.
    console.log(`[EMAIL] To: ${payload.to}, Subject: ${payload.subject}`);
    console.log(`[EMAIL] Content: ${payload.content}`);

    // Simular envío exitoso
    return true;
  }

  async sendWhatsapp(phoneNumber: string, message: string): Promise<boolean> {
    // Implementación de notificaciones push (Firebase, OneSignal, etc.)

    // Simular envío exitoso
    return true;
  }
}
