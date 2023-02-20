import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Favourites } from 'src/favourites/entities/favs.entity';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Artist, Album, Track, Favourites],
  synchronize: true,
};

export { options };
