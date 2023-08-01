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
  Query,
} from '@nestjs/common';
import { AlbumService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumsController {
  constructor(private service: AlbumService) {}

  @Get()
  async getAllEntities(): Promise<Album[]> {
    return this.service.findAll();
  }

  @Get('search')
  async getAlbumsByName(@Query('name') name: string): Promise<Album[]> {
    return this.service.findByName(name);
  }

  @Get(':id')
  async getAlbumById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Album> {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createAlbum(@Body() createDto: AlbumDto): Promise<Album> {
    return this.service.create(createDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateAlbum(
    @Body() updateDto: AlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Album> {
    return this.service.update(id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
