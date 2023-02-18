import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Track, (track) => track.favs)
  tracks: Track[];

  @OneToMany(() => Artist, (artist) => artist.favs)
  artists: Artist[];

  @OneToMany(() => Album, (album) => album.favs)
  albums: Album[];
}
