import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TrackDatabaseService } from './tracks.database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';

@Module({
  controllers: [TracksController],
  providers: [TrackDatabaseService],
  imports: [TypeOrmModule.forFeature([Track])],
  exports: [TrackDatabaseService],
})
export class TracksModule {}
