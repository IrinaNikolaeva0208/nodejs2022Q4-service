import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TrackService } from './tracks.service';
import { TrackDto } from './dto/track.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Track } from './entities/track.entity';
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
@ApiTags('tracks')
@Controller('track')
export class TracksController {
  constructor(private service: TrackService) {}

  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  async getAllTracks(): Promise<Track[]> {
    return this.service.findAll();
  }

  @ApiQuery({ name: 'name', required: true, description: 'Name of the track' })
  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('search')
  async getTracksByName(@Query('name') name: string): Promise<Track[]> {
    return this.service.findByName(name);
  }

  @ApiOkResponse({ description: 'Successful operation', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @Get(':id')
  async getTrackById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Track> {
    return this.service.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Successfully created', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid dto' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Post()
  async createTrack(@Body() createDto: TrackDto): Promise<Track> {
    return this.service.create(createDto);
  }

  @ApiOkResponse({ description: 'Successfully updated', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id or dto' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Put(':id')
  async updateTrack(
    @Body() updateDto: TrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Track> {
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
  async deleteTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
