import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import db from 'src/database/DB';

@Injectable()
export class UserService {
  findAll() {
    return db.users.map((user) => {
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
    const userToGet = db.users.find((user) => user.id == id);
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
    db.users.push(newUser);
    return {
      id: id,
      login: newUser.login,
      version: version,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  change(id: string, dto: UpdatePasswordDto) {
    const userToUpdate = db.users.find((user) => user.id == id);
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

  delete(id: string): User {
    const userToDelete = db.users.find((item) => item.id == id);
    if (userToDelete) db.users.splice(db.users.indexOf(userToDelete));
    return userToDelete;
  }
}
