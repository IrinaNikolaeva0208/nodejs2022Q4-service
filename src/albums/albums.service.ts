import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';
import { randomUUID } from 'crypto';
import { FavsService } from 'src/favourites/favs.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: string) {
    const albumToGet = await this.albumRepository.findOne({
      where: { id: id },
    });

    if (albumToGet) return albumToGet;

    throw new NotFoundException('Album not found');
  }

  async create(dto: AlbumDto) {
    const id = randomUUID();
    const newAlbum = {
      ...dto,
      id: id,
    };

    const createdAlbum = this.albumRepository.create(newAlbum);
    return await this.albumRepository.save(createdAlbum);
  }

  async update(id: string, dto: AlbumDto) {
    const albumToUpdate = await this.albumRepository.findOne({
      where: { id: id },
    });

    if (albumToUpdate) {
      for (let key in dto) albumToUpdate[key] = dto[key];
      return await this.albumRepository.save(albumToUpdate);
    }

    throw new NotFoundException('Album not found');
  }

  async delete(id: string) {
    const deleteAlbumResult = await this.albumRepository.delete(id);
    if (!deleteAlbumResult.affected)
      throw new NotFoundException('Album not found');
  }
}
