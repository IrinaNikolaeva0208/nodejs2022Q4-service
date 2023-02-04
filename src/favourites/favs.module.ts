import { Module } from '@nestjs/common';
import { GetFavsModule } from './favs/getFavs.module';
import { FavsAlbumsModule } from './albums/favs.albums.module';
import { FavsArtistsModule } from './artists/favs.artists.module';
import { FavsTracksModule } from './tracks/favs.tracks.module';

@Module({
  imports: [
    GetFavsModule,
    FavsAlbumsModule,
    FavsArtistsModule,
    FavsTracksModule,
  ],
})
export class FavsModule {}
