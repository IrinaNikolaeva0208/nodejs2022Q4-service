import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { TrackDto } from './dto/track.dto';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackDatabaseService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async findTrackToFavs(trackId: string): Promise<Track> {
    const track = await this.trackRepository.findOneBy({ id: trackId });
    return track;
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findByName(name: string): Promise<Track[]> {
    return await this.trackRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async findOne(id: string): Promise<Track> {
    const trackToGet = await this.trackRepository.findOne({
      where: { id: id },
    });

    if (trackToGet) return trackToGet;

    throw new NotFoundException('Track not found');
  }

  async create(dto: TrackDto): Promise<Track> {
    const createdTrack = this.trackRepository.create(dto);
    return await this.trackRepository.save(createdTrack);
  }

  async update(id: string, dto: TrackDto): Promise<Track> {
    const trackToUpdate = await this.trackRepository.findOne({
      where: { id: id },
    });

    if (trackToUpdate) {
      for (const key in dto) trackToUpdate[key] = dto[key];
      return await this.trackRepository.save(trackToUpdate);
    }

    throw new NotFoundException('Track not found');
  }

  async delete(id: string): Promise<void> {
    const deleteTrackResult = await this.trackRepository.delete(id);
    if (!deleteTrackResult.affected)
      throw new NotFoundException('Track not found');
  }
}
