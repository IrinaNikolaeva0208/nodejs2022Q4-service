import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    userLogin: string,
    userEmail: string,
    token: string,
  ) {
    const url = `${process.env.EMAIL_CONFIRMATION_URL}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome to Music Library! Confirm your Email',
      template: './confirm',
      context: {
        login: userLogin,
        supportEmail: process.env.MAIL_EMAIL,
        url,
      },
    });
  }
}
