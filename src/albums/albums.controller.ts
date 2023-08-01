import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlbumService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';

@Controller('album')
export class AlbumsController {
  constructor(private service: AlbumService) {}

  @Get()
  async getAllEntities() {
    return this.service.findAll();
  }

  @Get(':id')
  async getAlbumById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createAlbum(@Body() createDto: AlbumDto) {
    return this.service.create(createDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateAlbum(
    @Body() updateDto: AlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.update(id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.delete(id);
  }
}
