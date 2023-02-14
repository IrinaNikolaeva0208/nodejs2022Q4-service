import { Injectable } from '@nestjs/common';
import db from 'src/database/DB';

@Injectable()
export class FavsService {
  handleArtistDeletion(id: string) {
    const artistToDeleteIndex = db.favourites.artists.findIndex(
      (itemId) => itemId == id,
    );
    if (artistToDeleteIndex != -1)
      db.favourites.artists.splice(artistToDeleteIndex, 1);
  }

  handleAlbumDeletion(id: string) {
    const albumToDeleteIndex = db.favourites.albums.findIndex(
      (itemId) => itemId == id,
    );
    if (albumToDeleteIndex != -1)
      db.favourites.albums.splice(albumToDeleteIndex, 1);
  }

  handleTrackDeletion(id: string) {
    const trackToDeleteIndex = db.favourites.tracks.findIndex(
      (itemId) => itemId == id,
    );
    if (trackToDeleteIndex == -1)
      db.favourites.tracks.splice(trackToDeleteIndex, 1);
  }

  findAllFavs() {
    return {
      artists: db.artists.filter((artist) =>
        db.favourites.artists.includes(artist.id),
      ),
      albums: db.albums.filter((album) =>
        db.favourites.albums.includes(album.id),
      ),
      tracks: db.tracks.filter((track) =>
        db.favourites.tracks.includes(track.id),
      ),
    };
  }

  addAlbumToFavs(id: string) {
    const albumToAdd = db.albums.find((item) => item.id == id);
    if (!albumToAdd) throw new Error();
    db.favourites.albums.push(id);
    return albumToAdd;
  }

  deleteAlbumFromFavs(id: string) {
    const albumToDeleteIndex = db.favourites.albums.findIndex(
      (itemId) => itemId == id,
    );
    if (albumToDeleteIndex == -1) throw new Error();
    db.favourites.albums.splice(albumToDeleteIndex, 1);
  }

  addArtistToFavs(id: string) {
    const artistToAdd = db.artists.find((item) => item.id == id);
    if (!artistToAdd) throw new Error();
    db.favourites.artists.push(id);
    return artistToAdd;
  }

  deleteArtistFromFavs(id: string) {
    const artistToDeleteIndex = db.favourites.artists.findIndex(
      (itemId) => itemId == id,
    );
    if (artistToDeleteIndex == -1) throw new Error();
    db.favourites.artists.splice(artistToDeleteIndex, 1);
  }

  addTrackToFavs(id: string) {
    const trackToAdd = db.tracks.find((item) => item.id == id);
    if (!trackToAdd) throw new Error();
    db.favourites.tracks.push(id);
    return trackToAdd;
  }

  deleteTrackFromFavs(id: string) {
    const trackToDeleteIndex = db.favourites.tracks.findIndex(
      (itemId) => itemId == id,
    );
    if (trackToDeleteIndex == -1) throw new Error();
    db.favourites.tracks.splice(trackToDeleteIndex, 1);
  }
}
