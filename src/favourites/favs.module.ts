import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Favourites } from './entities/favs.entity';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [
    AlbumsModule,
    ArtistsModule,
    TracksModule,
    TypeOrmModule.forFeature([Favourites]),
  ],
  exports: [FavsService],
})
export class FavsModule {}
