import { User } from 'src/users/interfaces/user.interface';
import { Artist } from 'src/artists/interfaces/artist.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { Album } from 'src/albums/intefaces/album.interface';

export interface Database {
  users: User[];
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  favourites: {
    artists: Artist[];
    tracks: Track[];
    albums: Album[];
  };
}
