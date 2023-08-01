import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { ArtistDto } from './dto/artist.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async findArtistToFavs(artistId: string): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({ id: artistId });
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artistToGet = await this.artistRepository.findOne({
      where: { id: id },
    });

    if (artistToGet) return artistToGet;
    throw new NotFoundException('Artist not found');
  }

  async create(dto: ArtistDto): Promise<Artist> {
    const createdArtist = this.artistRepository.create(dto);
    return await this.artistRepository.save(createdArtist);
  }

  async update(id: string, dto: ArtistDto): Promise<Artist> {
    const artistToUpdate = await this.artistRepository.findOne({
      where: { id: id },
    });

    if (artistToUpdate) {
      for (const key in dto) artistToUpdate[key] = dto[key];
      return await this.artistRepository.save(artistToUpdate);
    }

    throw new NotFoundException('Artist not found');
  }

  async delete(id: string): Promise<void> {
    const deleteArtistResult = await this.artistRepository.delete(id);
    if (!deleteArtistResult.affected)
      throw new NotFoundException('Artist not found');
  }
}
