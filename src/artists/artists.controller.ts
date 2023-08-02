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
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArtistService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Artist } from './entities/artist.entity';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('artists')
@Controller('artist')
export class ArtistsController {
  constructor(private service: ArtistService) {}

  @ApiOkResponse({ description: 'Successful operation', type: [Artist] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  async getAllArtists(): Promise<Artist[]> {
    return this.service.findAll();
  }

  @ApiOkResponse({ description: 'Successful operation', type: Artist })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @Get(':id')
  async getArtistById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    return this.service.findOne(id);
  }

  @ApiQuery({ name: 'name', required: true, description: 'Name of the artist' })
  @ApiOkResponse({ description: 'Successful operation', type: [Artist] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('search')
  async getArtistsByName(@Query('name') name: string): Promise<Artist[]> {
    console.log(name, 11);
    return this.service.findByName(name);
  }

  @ApiCreatedResponse({ description: 'Successfully created', type: Artist })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid dto' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Post()
  async createArtist(@Body() createDto: ArtistDto): Promise<Artist> {
    return this.service.create(createDto);
  }

  @ApiOkResponse({ description: 'Successfully updated', type: Artist })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id or dto' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Put(':id')
  async updateArtist(
    @Body() updateDto: ArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist> {
    return this.service.update(id, updateDto);
  }

  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
