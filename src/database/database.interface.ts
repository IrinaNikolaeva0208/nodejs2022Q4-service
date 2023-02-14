import { User } from 'src/users/entities/user.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';

export interface Database {
  users: User[];
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  favourites: {
    artists: string[];
    tracks: string[];
    albums: string[];
  };
}
