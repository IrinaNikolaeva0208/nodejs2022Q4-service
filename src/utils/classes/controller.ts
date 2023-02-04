import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Service } from './service';

export class EntityController<Serv extends Service> {
  constructor(protected service: Serv) {}

  isValidCreateDto(dto: any) {
    return false;
  }

  isValidUpdateDto(dto: any) {
    return false;
  }

  @Get()
  async getAllEntities() {
    return this.service.findAll();
  }

  @Get(':id')
  async getEntityById(@Param() params) {
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const entityToGet = this.service.findOne(params.id);
    if (!entityToGet)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return entityToGet;
  }

  @Post()
  async createEntity(@Body() createDto) {
    if (!this.isValidCreateDto(createDto))
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    return this.service.create(createDto);
  }

  @Put(':id')
  async updateEntity(@Body() updateDto, @Param() params) {
    if (!this.isValidUpdateDto(updateDto))
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const entityToUpdate = this.service.change(params.id, updateDto);
    if (!entityToUpdate)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return entityToUpdate;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEntity(@Param() params) {
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const entityToDelete = this.service.delete(params.id);
    if (!entityToDelete)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
