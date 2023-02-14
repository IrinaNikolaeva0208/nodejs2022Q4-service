import { Injectable } from '@nestjs/common';
import db from 'src/database/DB';
import { Artist } from './entities/artist.entity';
import { ArtistDto } from './dto/artist.dto';
import { randomUUID } from 'crypto';
import { TrackService } from 'src/tracks/tracks.service';
import { AlbumService } from 'src/albums/albums.service';
import { FavsService } from 'src/favourites/favs.service';

@Injectable()
export class ArtistService {
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private favsService: FavsService,
  ) {}

  findAll(): Artist[] {
    return db.artists;
  }

  findOne(id: string): Artist {
    return db.artists.find((item) => item.id == id);
  }

  create(dto: ArtistDto): Artist {
    const id = randomUUID();
    const newArtist = {
      ...dto,
      id: id,
    };
    db.artists.push(newArtist);
    return newArtist;
  }

  change(id: string, dto: ArtistDto): Artist {
    let artistToUpdate = db.artists.find((item) => item.id == id);
    if (artistToUpdate) artistToUpdate = { ...dto, id };
    return artistToUpdate;
  }

  delete(id: string): Artist {
    const artistToDelete = db.artists.find((item) => item.id == id);
    if (artistToDelete) {
      db.artists.splice(db.artists.indexOf(artistToDelete));
      this.favsService.handleArtistDeletion(id);
      this.trackService.handleArtistDeletion(id);
      this.albumService.handleArtistDeletion(id);
    }
    return artistToDelete;
  }
}
