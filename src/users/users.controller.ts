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
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Public } from 'src/auth/decorators/public';
import { adminDto } from './dto/createAdmin.dto';

@Controller('user')
export class UsersController {
  constructor(private service: UserService) {}

  @Public()
  @Post('admin')
  async createAdmin() {
    await this.service.create(adminDto, Role.Admin);
  }

  @Roles(Role.Admin)
  @Get()
  async getAllUsers() {
    return await this.service.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.service.findOneById(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createUser(@Body() createDto: CreateUserDto) {
    return await this.service.create(createDto, Role.User);
  }

  @Put(':id')
  async updateUser(
    @Body() updateDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.service.update(id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.delete(id);
  }
}
