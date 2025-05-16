// src/interfaces/services/notification.service.interface.ts

export interface NotificationPayload {
  to: string; // Email o identificador del destinatario
  subject: string;
  content: string;
  data?: any; // Datos adicionales
}

export interface NotificationService {
  sendEmail(payload: NotificationPayload): Promise<boolean>;
  sendWhatsapp(phoneNumber: string, message: string): Promise<boolean>;
}
