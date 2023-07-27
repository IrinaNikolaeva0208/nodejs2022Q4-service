import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { EmailConfirmationService } from './emailConfirmation.service';
import { MailModule } from 'src/mail/mail.module';
import { ConfirmStrategy } from './strategies/confirm.strategy';

@Module({
  imports: [
    MailModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailConfirmationService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    ConfirmStrategy,
  ],
})
export class AuthModule {}
