import { Post, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'uuid';
import { FavsEntityService } from './entity.service';

export class FavsEntityController<Service extends FavsEntityService> {
  constructor(private favsService: Service) {}

  @Post(':id')
  async addEntityToFavs(@Param() params) {
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    try {
      this.favsService.add(params.id);
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

  @Delete(':id')
  async deleteEntityFromFavs(@Param() params) {
    if (!validate(params.id))
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    try {
      this.favsService.delete(params.id);
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
