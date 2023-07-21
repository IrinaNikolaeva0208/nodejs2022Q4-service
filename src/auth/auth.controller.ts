import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Public } from 'src/decorators/public';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req: Request) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req.user);
  }
}
