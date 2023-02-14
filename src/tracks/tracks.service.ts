import { Injectable } from '@nestjs/common';
import db from 'src/database/DB';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';
import { TrackDto } from './dto/track.dto';
import { FavsService } from 'src/favourites/favs.service';

@Injectable()
export class TrackService {
  constructor(private favsService: FavsService) {}

  handleArtistDeletion(id: string) {
    const artistTracks = db.tracks.filter((track) => track.artistId == id);
    artistTracks.forEach((track) => (track.artistId = null));
  }

  handleAlbumDeletion(id: string) {
    const albumTracks = db.tracks.filter((track) => track.albumId == id);
    albumTracks.forEach((track) => (track.albumId = null));
  }

  findAll(): Track[] {
    return db.tracks;
  }

  findOne(id: string): Track {
    return db.tracks.find((item) => item.id == id);
  }

  create(dto: TrackDto): Track {
    const id = randomUUID();
    const newTrack = {
      ...dto,
      id: id,
    };
    db.tracks.push(newTrack);
    return newTrack;
  }

  change(id: string, dto: TrackDto): Track {
    let trackToUpdate = db.tracks.find((item) => item.id == id);
    if (trackToUpdate) trackToUpdate = { ...dto, id };
    return trackToUpdate;
  }

  delete(id: string): Track {
    const trackToDelete = db.tracks.find((item) => item.id == id);
    if (trackToDelete) {
      db.tracks.splice(db.tracks.indexOf(trackToDelete));
      this.favsService.handleTrackDeletion(id);
    }
    return trackToDelete;
  }
}
