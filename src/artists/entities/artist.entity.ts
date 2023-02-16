import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany((type) => Track, (track) => track.artist)
  tracks: Track[];

  @OneToMany((type) => Album, (album) => album.artist)
  albums: Album[];
}
