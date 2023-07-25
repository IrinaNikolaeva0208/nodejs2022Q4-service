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
import { FavsService } from 'src/favourites/favs.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private favsService: FavsService,
  ) {}

  async findAll() {
    return (await this.userRepository.find()).map((user) => user.toResponse());
  }

  async findOneById(id: string) {
    const userToGet = await this.userRepository.findOne({ where: { id } });
    if (userToGet) {
      return userToGet.toResponse();
    }
    throw new NotFoundException('User not found');
  }

  async findOneByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login } });
  }

  async create(dto: CreateUserDto, role: Role) {
    const timestamp = Date.now();
    const version = 1;
    const newUser = {
      ...dto,
      version: version,
      createdAt: timestamp,
      updatedAt: timestamp,
      role: role,
      password: await bcrypt.hash(dto.password, +process.env.CRYPT_SALT),
    };
    const createdUser = this.userRepository.create(newUser);
    createdUser.favourites = await this.favsService.createNewFavs();
    return (await this.userRepository.save(createdUser)).toResponse();
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: id },
    });
    if (userToUpdate) {
      if (!(await bcrypt.compare(dto.oldPassword, userToUpdate.password)))
        throw new ForbiddenException('Wrong password');
      userToUpdate.password = await bcrypt.hash(
        dto.newPassword,
        +process.env.CRYPT_SALT,
      );
      userToUpdate.updatedAt = Date.now();
      userToUpdate.version++;
      userToUpdate.createdAt = +userToUpdate.createdAt;
      return (await this.userRepository.save(userToUpdate)).toResponse();
    }
    throw new NotFoundException('User not found');
  }

  async delete(id: string) {
    const deleteUserResult = await this.userRepository.delete(id);
    if (!deleteUserResult.affected)
      throw new NotFoundException('User not found');
  }
}
