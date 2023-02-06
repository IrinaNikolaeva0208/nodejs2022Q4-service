import {
  Controller,
  Put,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './users.service';
import isValidUserCreateDto from './dto/createDto/validateDto';
import isValidUserUpdateDto from './dto/updateDto/validateDto';
import { EntityController } from 'src/utils/classes/controller';
import { validate } from 'uuid';

@Controller('user')
export class UsersController extends EntityController<UserService> {
  constructor(private userService: UserService) {
    super(userService);
  }

  isValidCreateDto(dto: any): boolean {
    return isValidUserCreateDto(dto);
  }

  isValidUpdateDto(dto: any): boolean {
    return isValidUserUpdateDto(dto);
  }

  @Put(':id')
  async updateEntity(@Body() updateDto, @Param() params) {
    if (!this.isValidUpdateDto(updateDto))
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    let userToUpdate;
    try {
      userToUpdate = this.service.change(params.id, updateDto);
    } catch (err) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    if (!userToUpdate)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return userToUpdate;
  }
}
