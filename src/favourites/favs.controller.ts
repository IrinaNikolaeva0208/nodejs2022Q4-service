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
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';

@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @Roles(Role.User)
  @Get()
  async getFavs(@Body() findFavs: FindFavsDto) {
    return await this.service.findAllFavs(findFavs.userId);
  }

  @Roles(Role.User)
  @Post('track/:id')
  async addTrackToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addTrackToFavs(id, findFavs.userId);
  }

  @Roles(Role.User)
  @Delete('track/:id')
  async deleteTrackFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteTrackFromFavs(id, findFavs.userId);
  }

  @Roles(Role.User)
  @Post('artist/:id')
  async addArtistToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addArtistToFavs(id, findFavs.userId);
  }

  @Roles(Role.User)
  @Delete('artist/:id')
  async deleteArtistFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteArtistFromFavs(id, findFavs.userId);
  }

  @Roles(Role.User)
  @Post('album/:id')
  async addAlbumToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.addAlbumToFavs(id, findFavs.userId);
  }

  @Roles(Role.User)
  @Delete('album/:id')
  async deleteAlbumFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
  ) {
    await this.service.deleteAlbumFromFavs(id, findFavs.userId);
  }
}
