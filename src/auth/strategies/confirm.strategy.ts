import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserPayload } from '../types/userPayload';

@Injectable()
export class ConfirmStrategy extends PassportStrategy(Strategy, 'jwt-confirm') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: process.env.JWT_VERIFICATION_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request): UserPayload {
    const confirmToken = req.query.token as string;
    if (!confirmToken) throw new UnauthorizedException();
    try {
      const payload = this.jwtService.verify(confirmToken, {
        secret: process.env.JWT_VERIFICATION_SECRET_KEY,
      });
      const user = {
        sub: payload.sub,
        login: payload.login,
        role: payload.role,
      };
      return user;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
