import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Param,
  Body,
  HttpException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TrackService } from './tracks.service';
import { TrackDto } from './dto/track.dto';

@Controller('track')
export class TracksController {
  constructor(private service: TrackService) {}

  @Get()
  async getAllTracks() {
    return this.service.findAll();
  }

  @Get(':id')
  async getTrackById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async createTrack(@Body() createDto: TrackDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async updateTrack(
    @Body() updateDto: TrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.delete(id);
  }
}
