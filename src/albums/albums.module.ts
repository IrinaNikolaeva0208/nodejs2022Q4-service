import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsController } from './albums.controller';
import { AlbumService } from './albums.service';
import { Album } from './entities/album.entity';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumService],
  imports: [TypeOrmModule.forFeature([Album])],
  exports: [AlbumService],
})
export class AlbumsModule {}
