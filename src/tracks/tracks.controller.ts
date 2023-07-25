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
} from '@nestjs/common';
import { TrackService } from './tracks.service';
import { TrackDto } from './dto/track.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';

@Controller('track')
export class TracksController {
  //
  constructor(private service: TrackService) {}

  @Get()
  async getAllTracks() {
    return this.service.findAll();
  }

  @Get(':id')
  async getTrackById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createTrack(@Body() createDto: TrackDto) {
    return this.service.create(createDto);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateTrack(
    @Body() updateDto: TrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.update(id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.delete(id);
  }
}
