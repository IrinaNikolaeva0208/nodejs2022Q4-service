import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  HttpException,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlbumService } from './albums.service';
import { AlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private service: AlbumService) {}

  @Get()
  async getAllEntities() {
    return this.service.findAll();
  }

  @Get(':id')
  async getAlbumById(@Param('id', new ParseUUIDPipe()) id: string) {
    const albumToGet = this.service.findOne(id);
    if (!albumToGet) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return albumToGet;
  }

  @Post()
  async createAlbum(@Body() createDto: AlbumDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async updateAlbum(
    @Body() updateDto: AlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const albumToUpdate = this.service.change(id, updateDto);
    if (!albumToUpdate)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return albumToUpdate;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const albumToDelete = this.service.delete(id);
    if (!albumToDelete)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
