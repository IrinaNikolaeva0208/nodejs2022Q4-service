import {
  Controller,
  Get,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @Get()
  async getFavs() {
    return this.service.findAllFavs();
  }

  @Post('track/:id')
  async addTrackToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.addTrackToFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    throw new HttpException(
      'Successfully added to favourites',
      HttpStatus.CREATED,
    );
  }

  @Delete('track/:id')
  async deleteTrackFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.deleteTrackFromFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
    throw new HttpException(
      'Successfully deleted from favourites',
      HttpStatus.NO_CONTENT,
    );
  }

  @Post('artist/:id')
  async addArtistToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.addArtistToFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    throw new HttpException(
      'Successfully added to favourites',
      HttpStatus.CREATED,
    );
  }

  @Delete('artist/:id')
  async deleteArtistFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.deleteArtistFromFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
    throw new HttpException(
      'Successfully deleted from favourites',
      HttpStatus.NO_CONTENT,
    );
  }

  @Post('album/:id')
  async addAlbumToFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.addAlbumToFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    throw new HttpException(
      'Successfully added to favourites',
      HttpStatus.CREATED,
    );
  }

  @Delete('album/:id')
  async deleteAlbumFromFavs(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.service.deleteAlbumFromFavs(id);
    } catch (err) {
      throw new HttpException(
        'Source not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
    throw new HttpException(
      'Successfully deleted from favourites',
      HttpStatus.NO_CONTENT,
    );
  }
}
