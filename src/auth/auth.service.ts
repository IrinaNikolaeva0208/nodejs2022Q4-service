import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Role } from './enums/roles.enum';
import * as bcrypt from 'bcrypt';
import { EmailConfirmationService } from './emailConfirmation.service';
import { User } from 'src/users/entities/user.entity';
import { UserPayload } from './types/userPayload';
import { GetTokensResponse } from './types/getTokensResponse';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  async signUp(
    userDto: CreateUserDto,
  ): Promise<Omit<User, 'favourites' | 'toResponse' | 'password'>> {
    const user = await this.usersService.create(userDto, Role.User);
    const payload = { sub: user.id, login: user.login, role: user.role };
    this.emailConfirmationService.sendEmailConfirmation(payload, user.email);
    return user;
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<Omit<User, 'favourites' | 'toResponse'> | null> {
    const user = await this.usersService.findOneByLogin(login);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async refreshTokens(payload: UserPayload): Promise<GetTokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
