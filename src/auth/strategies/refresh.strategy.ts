import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!refreshToken) throw new UnauthorizedException('00');
    try {
      const payload = this.jwtService.verify(refreshToken);
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
