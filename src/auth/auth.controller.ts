import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request as Req,
  UseGuards,
  Patch,
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
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GetTokensResponse } from './types/getTokensResponse';
import { User } from 'src/users/entities/user.entity';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  @ApiOkResponse({
    description: 'Successfully signed in',
    type: GetTokensResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect login or password' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Req() req: Request) {
    return this.authService.refreshTokens(req.user as UserPayload);
  }

  @ApiCreatedResponse({
    description:
      'Successfully signed up. To continue, please, confirm your email',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid dto' })
  @ApiConflictResponse({ description: 'Login or email already in use' })
  @Public()
  @Post('signup')
  async signUp(
    @Body() userDto: CreateUserDto,
  ): Promise<Omit<User, 'favourites' | 'toResponse' | 'password'>> {
    return this.authService.signUp(userDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully refreshed',
    type: GetTokensResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuardGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<GetTokensResponse> {
    return await this.authService.refreshTokens(req.user as UserPayload);
  }

  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Email confirmation token',
  })
  @ApiOkResponse({
    description: 'Successfully confirmed',
    type: GetTokensResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Public()
  @UseGuards(JwtConfirmGuard)
  @Patch('confirm')
  async confirmUserEmail(@Req() req: Request): Promise<GetTokensResponse> {
    await this.emailConfirmationService.confirmEmail(req.user as UserPayload);
    return await this.authService.refreshTokens(req.user as UserPayload);
  }
}
