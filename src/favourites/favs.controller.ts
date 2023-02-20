import {
  Controller,
  Get,
  Post,
  Delete,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @Get()
  async getFavs() {
    return await this.service.findAllFavs();
  }

  @Post('track/:id')
  async addTrackToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.addTrackToFavs(id);
  }

  @Delete('track/:id')
  async deleteTrackFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteTrackFromFavs(id);
  }

  @Post('artist/:id')
  async addArtistToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.addArtistToFavs(id);
  }

  @Delete('artist/:id')
  async deleteArtistFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteArtistFromFavs(id);
  }

  @Post('album/:id')
  async addAlbumToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.addAlbumToFavs(id);
  }

  @Delete('album/:id')
  async deleteAlbumFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.deleteAlbumFromFavs(id);
  }
}
