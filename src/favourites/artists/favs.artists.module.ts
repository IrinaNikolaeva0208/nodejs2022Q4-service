import { Module } from '@nestjs/common';
import { FavsArtistsController } from './favs.artists.controller';
import { FavsArtistsService } from './favs.artists.service';

@Module({
  controllers: [FavsArtistsController],
  providers: [FavsArtistsService],
})
export class FavsArtistsModule {}
