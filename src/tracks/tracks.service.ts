import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { TrackDto } from './dto/track.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async findTrackToFavs(trackId: string) {
    const track = await this.trackRepository.findOneBy({ id: trackId });
    return track;
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(id: string) {
    const trackToGet = await this.trackRepository.findOne({
      where: { id: id },
    });

    if (trackToGet) return trackToGet;

    throw new NotFoundException('Track not found');
  }

  async create(dto: TrackDto) {
    const createdTrack = this.trackRepository.create(dto);
    return await this.trackRepository.save(createdTrack);
  }

  async update(id: string, dto: TrackDto) {
    const trackToUpdate = await this.trackRepository.findOne({
      where: { id: id },
    });

    if (trackToUpdate) {
      for (const key in dto) trackToUpdate[key] = dto[key];
      return await this.trackRepository.save(trackToUpdate);
    }

    throw new NotFoundException('Track not found');
  }

  async delete(id: string) {
    const deleteTrackResult = await this.trackRepository.delete(id);
    if (!deleteTrackResult.affected)
      throw new NotFoundException('Track not found');
  }
}
