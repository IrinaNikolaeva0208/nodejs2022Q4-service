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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TrackDatabaseService } from './tracks.database.service';
import { TrackDto } from './dto/track.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Track } from './entities/track.entity';
import { TrackFilesService } from './tracks.files.service';
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
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tracks')
@Controller('track')
export class TracksController {
  constructor(private trackDatabaseService: TrackDatabaseService) {}

  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  async getAllTracks(): Promise<Track[]> {
    return this.trackDatabaseService.findAll();
  }

  @ApiQuery({ name: 'name', required: true, description: 'Name of the track' })
  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('search')
  async getTracksByName(@Query('name') name: string): Promise<Track[]> {
    return this.trackDatabaseService.findByName(name);
  }

  @ApiOkResponse({ description: 'Successful operation', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @Get(':id')
  async getTrackById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Track> {
    return this.trackDatabaseService.findOne(id);
  }

  @ApiCreatedResponse({ description: 'Successfully created', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid dto' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: TrackDto,
  })
  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(TrackFilesService.getFileInterceptor())
  async createTrack(
    @UploadedFile(TrackFilesService.getFilePipe())
    file: Express.Multer.File,
    @Body() createDto: TrackDto,
  ): Promise<Track> {
    return this.trackDatabaseService.create({
      ...createDto,
      file: file.filename,
    });
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
    return this.trackDatabaseService.update(id, updateDto);
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
    const { file } = await this.trackDatabaseService.findOne(id);
    await this.trackDatabaseService.delete(id);
    TrackFilesService.deleteTrackFile(file);
  }
}
