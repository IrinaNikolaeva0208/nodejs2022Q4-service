import { Module } from '@nestjs/common';
import { FavsAlbumsController } from './favs.albums.controller';
import { FavsAlbumsService } from './favs.albums.service';

@Module({
  controllers: [FavsAlbumsController],
  providers: [FavsAlbumsService],
})
export class FavsAlbumsModule {}
