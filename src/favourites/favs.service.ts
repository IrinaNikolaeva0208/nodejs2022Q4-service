import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourites } from './entities/favs.entity';
import { ArtistService } from 'src/artists/artists.service';
import { AlbumService } from 'src/albums/albums.service';
import { TrackService } from 'src/tracks/tracks.service';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favourites)
    private favsRepository: Repository<Favourites>,
    private albumService: AlbumService,
    private artistService: ArtistService,
    private trackService: TrackService,
  ) {
    const createIfDoesNotExist = async () => {
      const favs = await this.favsRepository.find();
      if (!favs.length) {
        const newFavs = this.favsRepository.create();
        await this.favsRepository.save(newFavs);
      }
    };
    createIfDoesNotExist();
  }

  async findAllFavs() {
    return (
      await this.favsRepository.find({
        relations: { artists: true, albums: true, tracks: true },
      })
    )[0];
  }

  async addAlbumToFavs(id: string) {
    const favs = await this.findAllFavs();
    const album = await this.albumService.findAlbumToFavs(id);
    if (!album)
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    favs.albums.push(album);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully added to Favourites',
      HttpStatus.CREATED,
    );
  }

  async deleteAlbumFromFavs(id: string) {
    const favs = await this.findAllFavs();
    const album = await this.albumService.findAlbumToFavs(id);
    if (!album)
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    const albumIndex = favs.albums.findIndex((item) => item.id == album.id);
    favs.albums.splice(albumIndex, 1);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully deleted from Favourites',
      HttpStatus.NO_CONTENT,
    );
  }

  async addArtistToFavs(id: string) {
    const favs = await this.findAllFavs();
    const artist = await this.artistService.findArtistToFavs(id);
    if (!artist)
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    favs.artists.push(artist);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully added to Favourites',
      HttpStatus.CREATED,
    );
  }

  async deleteArtistFromFavs(id: string) {
    const favs = await this.findAllFavs();
    const artist = await this.artistService.findArtistToFavs(id);
    if (!artist)
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    const artistIndex = favs.artists.findIndex((item) => item.id == artist.id);
    favs.artists.splice(artistIndex, 1);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully deleted from Favourites',
      HttpStatus.NO_CONTENT,
    );
  }

  async addTrackToFavs(id: string) {
    const favs = await this.findAllFavs();
    const track = await this.trackService.findTrackToFavs(id);
    if (!track)
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    favs.tracks.push(track);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully added to Favourites',
      HttpStatus.CREATED,
    );
  }

  async deleteTrackFromFavs(id: string) {
    const favs = await this.findAllFavs();
    const track = await this.trackService.findTrackToFavs(id);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    const trackIndex = favs.tracks.findIndex((item) => item.id == track.id);
    favs.tracks.splice(trackIndex, 1);
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully deleted from Favourites',
      HttpStatus.NO_CONTENT,
    );
  }
}
