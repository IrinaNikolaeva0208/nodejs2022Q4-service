import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Service } from 'src/utils/classes/service';
import db from 'src/utils/database/DB';

@Injectable()
export class UserService extends Service {
  route = 'users';

  findAll() {
    return db[this.route].map((user) => {
      return {
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  }

  findOne(id: string) {
    const userToGet = db[this.route].find((user) => user.id == id);
    if (userToGet) {
      return {
        id: id,
        login: userToGet.login,
        version: userToGet.version,
        createdAt: userToGet.createdAt,
        updatedAt: userToGet.updatedAt,
      };
    }
    return userToGet;
  }

  create(dto: CreateUserDto) {
    const timestamp = +new Date();
    const id = v4();
    const version = 1;
    const newUser: User = {
      id: id,
      ...dto,
      version: version,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    db[this.route].push(newUser);
    return {
      id: id,
      login: newUser.login,
      version: version,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  change(id: string, dto: UpdatePasswordDto) {
    const userToUpdate = db[this.route].find((user) => user.id == id);
    if (userToUpdate) {
      if (userToUpdate.password != dto.oldPassword) throw new Error();
      userToUpdate.password = dto.newPassword;
      userToUpdate.updatedAt = +new Date();
      userToUpdate.version++;
      return {
        id: id,
        login: userToUpdate.login,
        version: userToUpdate.version,
        createdAt: userToUpdate.createdAt,
        updatedAt: userToUpdate.updatedAt,
      };
    }
    return userToUpdate;
  }
}
