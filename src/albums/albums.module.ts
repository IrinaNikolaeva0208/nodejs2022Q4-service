import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { FavsModule } from 'src/favourites/favs.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsController } from './albums.controller';
import { AlbumService } from './albums.service';
import { Album } from './entities/album.entity';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumService],
  imports: [TracksModule, FavsModule, TypeOrmModule.forFeature([Album])],
  exports: [AlbumService],
})
export class AlbumsModule {}
