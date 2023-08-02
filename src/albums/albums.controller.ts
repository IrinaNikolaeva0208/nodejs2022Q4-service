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
@ApiTags('albums')
@Controller('album')
export class AlbumsController {
  constructor(private service: AlbumService) {}

  @ApiOkResponse({ description: 'Successful operation', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  async getAllEntities(): Promise<Album[]> {
    return this.service.findAll();
  }

  @ApiQuery({ name: 'name', required: true, description: 'Name of the album' })
  @ApiOkResponse({ description: 'Successful operation', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('search')
  async getAlbumsByName(@Query('name') name: string): Promise<Album[]> {
    return this.service.findByName(name);
  }

  @ApiOkResponse({ description: 'Successful operation', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @Get(':id')
  async getAlbumById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Album> {
    return this.service.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Successfully created', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid dto' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Post()
  async createAlbum(@Body() createDto: AlbumDto): Promise<Album> {
    return this.service.create(createDto);
  }

  @ApiOkResponse({ description: 'Successfully updated', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id or dto' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Put(':id')
  async updateAlbum(
    @Body() updateDto: AlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Album> {
    return this.service.update(id, updateDto);
  }

  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
