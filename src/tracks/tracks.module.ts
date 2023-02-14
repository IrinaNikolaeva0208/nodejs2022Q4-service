import { Module } from '@nestjs/common';
import { FavsModule } from 'src/favourites/favs.module';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';

@Module({
  controllers: [TracksController],
  providers: [TrackService],
  imports: [FavsModule, TypeOrmModule.forFeature([Track])],
  exports: [TrackService],
})
export class TracksModule {}
