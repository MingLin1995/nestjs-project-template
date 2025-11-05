// import { Injectable, Logger } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { lastValueFrom } from 'rxjs';
// import { NotificationService, NotificationPayload } from '../interfaces/notification.interface';
// import { NotificationTemplateService } from '../templates/notification-template.service';

// @Injectable()
// export class SmsNotificationService implements NotificationService {
//   private readonly logger = new Logger(SmsNotificationService.name);

//   constructor(
//     private readonly httpService: HttpService,
//     private readonly templateService: NotificationTemplateService,
//   ) {}

//   async sendNotification(payload: NotificationPayload): Promise<void> {
//     if (!payload.recipient.phone) {
//       this.logger.warn('No phone provided for SMS notification');
//       return;
//     }

//     try {
//       const template = this.templateService.generateTemplate(
//         payload.event,
//         payload.data,
//         payload.recipientType,
//       );

//       await this.sendSms(payload.recipient.phone, template.content);

//       this.logger.log(
//         `Successfully sent SMS notification for ${payload.event} to ${payload.recipient.phone}`,
//       );
//     } catch (error) {
//       this.logger.error(
//         `Failed to send SMS notification for ${payload.event} to ${payload.recipient.phone}:`,
//         error,
//       );
//       throw error;
//     }
//   }

//   // 呼叫 SMS API 發送簡訊（使用 Every8d）
//   private async sendSms(phone: string, message: string): Promise<void> {
//     const mobile = this.formatTaiwanPhone(phone);

//     const payload = {
//       uid: process.env.EVERY8D_UID,
//       pwd: process.env.EVERY8D_PWD,
//       subject: '驗證碼',
//       msg: message,
//       mobiles: mobile,
//       sendtime: '',
//       retrytime: '1440',
//     };

//     const url = `https://${process.env.EVERY8D_SITE_URL}/${process.env.EVERY8D_CUST_CODE}/sendsms`;

//     try {
//       const response = await lastValueFrom(
//         this.httpService.post(url, payload, {
//           headers: { 'Content-Type': 'application/json' },
//         }),
//       );

//       if (response.data?.status !== '200') {
//         this.logger.error(`簡訊發送失敗: ${JSON.stringify(response.data)}`);
//         throw new Error(`SMS sending failed: ${response.data?.message}`);
//       }
//     } catch (error) {
//       this.logger.error(`發送簡訊錯誤: ${error.message}`, error.stack);
//       throw error;
//     }
//   }

//   private formatTaiwanPhone(phone: string): string {
//     // 去除非數字
//     const cleanPhone = phone.replace(/\D/g, '');
//     // 如果是 09 開頭，轉成 +886
//     if (cleanPhone.startsWith('09')) {
//       return `+886${cleanPhone.substring(1)}`;
//     }
//     return phone; // 已經是國碼格式就直接回傳
//   }
// }
