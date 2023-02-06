import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavsModule } from './favourites/favs.module';

@Module({
  imports: [UsersModule, ArtistsModule, AlbumsModule, TracksModule, FavsModule],
})
export class AppModule {}
