import { Module, forwardRef } from '@nestjs/common';
import { FavsModule } from 'src/favourites/favs.module';
import { FavsService } from 'src/favourites/favs.service';
import { TracksController } from './tracks.controller';
import { TrackService } from './tracks.service';

@Module({
  controllers: [TracksController],
  providers: [TrackService],
  imports: [FavsModule],
  exports: [TrackService],
})
export class TracksModule {}
