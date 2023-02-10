import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArtistService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private service: ArtistService) {}

  @Get()
  async getAllArtists() {
    return this.service.findAll();
  }

  @Get(':id')
  async getArtistById(@Param('id', new ParseUUIDPipe()) id: string) {
    const artistToGet = this.service.findOne(id);
    if (!artistToGet)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return artistToGet;
  }

  @Post()
  async createArtist(@Body() createDto: ArtistDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async updateArtist(
    @Body() updateDto: ArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const artistToUpdate = this.service.change(id, updateDto);
    if (!artistToUpdate)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return artistToUpdate;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const artistToDelete = this.service.delete(id);
    if (!artistToDelete)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
