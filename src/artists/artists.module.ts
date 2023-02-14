import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistService } from './artists.service';
import { FavsModule } from 'src/favourites/favs.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Artist } from './entities/artist.entity';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService],
  imports: [
    AlbumsModule,
    TracksModule,
    FavsModule,
    TypeOrmModule.forFeature([Artist]),
  ],
  exports: [ArtistService],
})
export class ArtistsModule {}
