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
    const favs = this.favsRepository.create();
    this.favsRepository.save(favs);
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
    favs.albums.splice(favs.albums.indexOf(album));
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
    favs.artists.splice(favs.artists.indexOf(artist));
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
    favs.tracks.splice(favs.tracks.indexOf(track));
    await this.favsRepository.save(favs);
    throw new HttpException(
      'Successfully deleted from Favourites',
      HttpStatus.NO_CONTENT,
    );
  }
}
