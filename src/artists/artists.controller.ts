import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArtistService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private service: ArtistService) {}

  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async getArtistById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createArtist(@Body() createDto: ArtistDto): Promise<Artist> {
    return this.service.create(createDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateArtist(
    @Body() updateDto: ArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    return this.service.update(id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
