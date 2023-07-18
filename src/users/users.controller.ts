import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
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
    return await this.service.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.service.findOneById(id);
  }

  @Post()
  async createUser(@Body() createDto: CreateUserDto) {
    return await this.service.create(createDto);
  }

  @Put(':id')
  async updateUser(
    @Body() updateDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.delete(id);
  }
}
