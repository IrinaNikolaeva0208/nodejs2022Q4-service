import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Controller('user')
export class UsersController {
  constructor(private service: UserService) {}

  @Get()
  async getAllUsers() {
    return this.service.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    const userToGet = this.service.findOne(id);
    if (!userToGet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return userToGet;
  }

  @Post()
  async createUser(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async updateUser(
    @Body() updateDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    let userToUpdate;
    try {
      userToUpdate = this.service.change(id, updateDto);
    } catch (err) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    if (!userToUpdate)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return userToUpdate;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    const userToDelete = this.service.delete(id);
    if (!userToDelete)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
