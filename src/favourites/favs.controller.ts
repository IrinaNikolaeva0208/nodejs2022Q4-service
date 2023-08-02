import {
  Controller,
  Get,
  Post,
  Delete,
  ParseUUIDPipe,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { FindFavsDto } from './dto/findFavs.dto';
import { FavsService } from './favs.service';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Favourites } from './entities/favs.entity';
import { Request } from 'express';
import { UserPayload } from 'src/auth/types/userPayload';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('favourites')
@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @ApiOkResponse({ description: 'Successful operation', type: Favourites })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Get()
  async getFavs(
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<Favourites> {
    return await this.service.findAllFavs(
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiCreatedResponse({ description: 'Successfully added to favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiUnprocessableEntityResponse({ description: 'Track does not exist' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Post('track/:id')
  async addTrackToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.addTrackToFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiNoContentResponse({ description: 'Successfully deleted from favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track is not favourite' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Delete('track/:id')
  async deleteTrackFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.deleteTrackFromFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiCreatedResponse({ description: 'Successfully added to favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiUnprocessableEntityResponse({ description: 'Artist does not exist' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Post('artist/:id')
  async addArtistToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.addArtistToFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiNoContentResponse({ description: 'Successfully deleted from favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist is not favourite' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Delete('artist/:id')
  async deleteArtistFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.deleteArtistFromFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiCreatedResponse({ description: 'Successfully added to favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiUnprocessableEntityResponse({ description: 'Album does not exist' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Post('album/:id')
  async addAlbumToFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.addAlbumToFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }

  @ApiNoContentResponse({ description: 'Successfully deleted from favourites' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album is not favourite' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.User)
  @Delete('album/:id')
  async deleteAlbumFromFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() findFavs: FindFavsDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.service.deleteAlbumFromFavs(
      id,
      findFavs.userId,
      (req.user as UserPayload).sub,
    );
  }
}
