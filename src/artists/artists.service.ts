import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { ArtistDto } from './dto/artist.dto';
import { randomUUID } from 'crypto';
import { FavsService } from 'src/favourites/favs.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(id: string) {
    const artistToGet = await this.artistRepository.findOne({
      where: { id: id },
    });

    if (artistToGet) return artistToGet;
    throw new NotFoundException('Artist not found');
  }

  async create(dto: ArtistDto) {
    const id = randomUUID();
    const newArtist = {
      ...dto,
      id: id,
    };

    const createdArtist = this.artistRepository.create(newArtist);
    return await this.artistRepository.save(createdArtist);
  }

  async update(id: string, dto: ArtistDto) {
    const artistToUpdate = await this.artistRepository.findOne({
      where: { id: id },
    });

    if (artistToUpdate) {
      for (let key in dto) artistToUpdate[key] = dto[key];
      return await this.artistRepository.save(artistToUpdate);
    }

    throw new NotFoundException('Artist not found');
  }

  async delete(id: string) {
    const deleteArtistResult = await this.artistRepository.delete(id);
    if (!deleteArtistResult.affected)
      throw new NotFoundException('Artist not found');
  }
}
