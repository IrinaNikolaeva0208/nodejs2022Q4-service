import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistService } from './artists.service';
import { FavsService } from 'src/favourites/favs.service';
import { TrackService } from 'src/tracks/tracks.service';
import { AlbumService } from 'src/albums/albums.service';
import { FavsModule } from 'src/favourites/favs.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService],
  imports: [AlbumsModule, TracksModule, FavsModule],
  exports: [ArtistService],
})
export class ArtistsModule {}
