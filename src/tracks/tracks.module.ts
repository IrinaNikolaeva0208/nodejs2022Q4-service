import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';

@Module({
  controllers: [TracksController],
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([Track])],
  exports: [TrackService],
})
export class TracksModule {}
