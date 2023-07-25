import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { Role } from './enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    const user = await this.usersService.create(userDto, Role.User);
    const payload = { sub: user.id, login: user.login, role: Role.User };
    return this.refreshTokens(payload);
  }

  async signIn(user: any) {
    const payload = { sub: user.id, login: user.login, role: user.role };
    return this.refreshTokens(payload);
  }

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findOneByLogin(login);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user.toResponse();
    }
    return null;
  }

  async refreshTokens(payload: any) {
    console.log(payload);
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
