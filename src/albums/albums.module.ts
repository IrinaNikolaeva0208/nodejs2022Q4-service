import { Module, forwardRef } from '@nestjs/common';
import { FavsModule } from 'src/favourites/favs.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsController } from './albums.controller';
import { AlbumService } from './albums.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumService],
  imports: [TracksModule, FavsModule],
  exports: [AlbumService],
})
export class AlbumsModule {}
