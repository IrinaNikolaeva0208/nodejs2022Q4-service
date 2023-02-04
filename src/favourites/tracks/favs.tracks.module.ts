import { Module } from '@nestjs/common';
import { FavsTracksController } from './favs.tracks.controller';
import { FavsTracksService } from './favs.tracks.service';

@Module({
  controllers: [FavsTracksController],
  providers: [FavsTracksService],
})
export class FavsTracksModule {}
