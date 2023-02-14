import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return (await this.userRepository.find()).map((user) => user.toResponse());
  }

  async findOne(id: string) {
    const userToGet = await this.userRepository.findOne({ where: { id: id } });
    if (userToGet) {
      return userToGet.toResponse();
    }
    throw new NotFoundException('User not found');
  }

  async create(dto: CreateUserDto) {
    const timestamp = Date.now();
    const id = randomUUID();
    const version = 1;
    const newUser = {
      id: id,
      ...dto,
      version: version,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const createdUser = this.userRepository.create(newUser);
    return (await this.userRepository.save(createdUser)).toResponse();
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: id },
    });
    if (userToUpdate) {
      if (userToUpdate.password != dto.oldPassword)
        throw new ForbiddenException('Wrong password');
      userToUpdate.password = dto.newPassword;
      userToUpdate.updatedAt = Date.now();
      userToUpdate.version++;
      userToUpdate.createdAt = +userToUpdate.createdAt;
      return (await this.userRepository.save(userToUpdate)).toResponse();
    }
    throw new NotFoundException('User not found');
  }

  async delete(id: string) {
    const userToDelete = await this.userRepository.delete(id);
    if (!userToDelete.affected) throw new NotFoundException('User not found');
  }
}
