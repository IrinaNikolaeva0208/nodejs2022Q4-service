import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  async findAlbumToFavs(albumId: string) {
    const album = await this.albumRepository.findOneBy({ id: albumId });
    return album;
  }

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
    const createdAlbum = this.albumRepository.create(dto);
    return await this.albumRepository.save(createdAlbum);
  }

  async update(id: string, dto: AlbumDto) {
    const albumToUpdate = await this.albumRepository.findOne({
      where: { id: id },
    });

    if (albumToUpdate) {
      for (const key in dto) albumToUpdate[key] = dto[key];
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
