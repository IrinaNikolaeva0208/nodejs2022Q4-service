import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Track {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  duration: number;

  @ApiProperty()
  @Column()
  file: string;

  @ApiProperty()
  @Column({ nullable: true })
  artistId: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  albumId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
