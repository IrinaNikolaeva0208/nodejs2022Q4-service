import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';

@Module({
  controllers: [TracksController],
  providers: [TrackService],
})
export class TracksModule {}
