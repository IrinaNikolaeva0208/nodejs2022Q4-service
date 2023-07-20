import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto) {
    await this.usersService.create(userDto);
  }

  async signIn(user: any) {
    const payload = { sub: user.id, login: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findOneByLogin(login);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
