import { Injectable } from '@nestjs/common';
import db from 'src/database/DB';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';
import { randomUUID } from 'crypto';
import { TrackService } from 'src/tracks/tracks.service';
import { FavsService } from 'src/favourites/favs.service';

@Injectable()
export class AlbumService {
  constructor(
    private trackService: TrackService,
    private favsService: FavsService,
  ) {}

  handleArtistDeletion(id: string) {
    const artistAlbums = db.albums.filter((album) => album.artistId == id);
    artistAlbums.forEach((album) => (album.artistId = null));
  }

  findAll(): Album[] {
    return db.albums;
  }

  findOne(id: string): Album {
    return db.albums.find((item) => item.id == id);
  }

  create(dto: AlbumDto): Album {
    const id = randomUUID();
    const newAlbum = {
      ...dto,
      id: id,
    };
    db.albums.push(newAlbum);
    return newAlbum;
  }

  change(id: string, dto: AlbumDto): Album {
    let albumToUpdate = db.albums.find((item) => item.id == id);
    if (albumToUpdate) albumToUpdate = { ...dto, id };
    return albumToUpdate;
  }

  delete(id: string): Album {
    const albumToDelete = db.albums.find((item) => item.id == id);
    if (albumToDelete) {
      db.albums.splice(db.albums.indexOf(albumToDelete));
      this.favsService.handleAlbumDeletion(id);
      this.trackService.handleAlbumDeletion(id);
    }
    return albumToDelete;
  }
}
