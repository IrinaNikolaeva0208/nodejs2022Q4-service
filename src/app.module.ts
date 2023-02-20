import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavsModule } from './favourites/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './database/ormconfig';

@Module({
  imports: [
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavsModule,
    TypeOrmModule.forRoot(options),
  ],
})
export class AppModule {}
