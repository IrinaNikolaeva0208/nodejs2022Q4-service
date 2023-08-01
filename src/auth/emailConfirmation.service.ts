import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/users/users.service';
import { UserPayload } from './types/userPayload';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendEmailConfirmation(
    payload: UserPayload,
    email: string,
  ): Promise<void> {
    const verificationToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_VERIFICATION_SECRET_KEY,
      expiresIn: process.env.JWT_VERIFICATION_EXPIRE_TIME,
    });
    this.mailService.sendUserConfirmation(
      payload.login,
      email,
      verificationToken,
    );
  }

  async confirmEmail(user: UserPayload): Promise<void> {
    await this.userService.markEmailAsConfirmed(user.login);
  }
}
