import {
  Controller,
  Get,
  Post,
  Delete,
  ParseUUIDPipe,
  Param,
  Body,
} from '@nestjs/common';
import { FindFavsDto } from './dto/findFavs.dto';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @Get()
  async getFavs(@Body() findFavs: FindFavsDto) {
    return await this.service.findAllFavs(findFavs.userId);
  }

  @Post('track/:id')
  async addTrackToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addTrackToFavs(id, findFavs.userId);
  }

  @Delete('track/:id')
  async deleteTrackFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteTrackFromFavs(id, findFavs.userId);
  }

  @Post('artist/:id')
  async addArtistToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addArtistToFavs(id, findFavs.userId);
  }

  @Delete('artist/:id')
  async deleteArtistFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteArtistFromFavs(id, findFavs.userId);
  }

  @Post('album/:id')
  async addAlbumToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addAlbumToFavs(id, findFavs.userId);
  }

  @Delete('album/:id')
  async deleteAlbumFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteAlbumFromFavs(id, findFavs.userId);
  }
}
