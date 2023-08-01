import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request as Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Public } from 'src/auth/decorators/public';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EmailConfirmationService } from './emailConfirmation.service';
import { JwtConfirmGuard } from './guards/jwt-confirm.guard';
import { JwtRefreshGuardGuard } from './guards/jwt-refresh.guard';
import { UserPayload } from './types/userPayload';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req: Request) {
    return this.authService.refreshTokens(req.user as UserPayload);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuardGuard)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    return await this.authService.refreshTokens(req.user as UserPayload);
  }

  @Public()
  @UseGuards(JwtConfirmGuard)
  @Get('confirm')
  async confirmUserEmail(@Req() req: Request) {
    await this.emailConfirmationService.confirmEmail(req.user as UserPayload);
    return await this.authService.refreshTokens(req.user as UserPayload);
  }
}
