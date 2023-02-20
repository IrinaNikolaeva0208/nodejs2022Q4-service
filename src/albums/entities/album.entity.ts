import { Artist } from 'src/artists/entities/artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Track } from 'src/tracks/entities/track.entity';
import { Favourites } from 'src/favourites/entities/favs.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];

  @ManyToOne(() => Favourites, (favs) => favs.albums)
  @JoinColumn()
  favs: Favourites;
}
