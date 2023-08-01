import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtConfirmGuard extends AuthGuard('jwt-confirm') {}
