import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Favourites {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];

  @ApiProperty()
  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];

  @ApiProperty()
  @ManyToMany(() => Album)
  @JoinTable()
  albums: Album[];

  @OneToOne(() => User, (user) => user.favourites, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
