import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html: content,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
