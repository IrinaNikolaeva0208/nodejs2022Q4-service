import { Controller } from '@nestjs/common';
import { EntityController } from 'src/utils/classes/controller';
import { TrackService } from './tracks.service';
import isValidTrackDto from './dto/validateDto';

@Controller('track')
export class TracksController extends EntityController<TrackService> {
  constructor(private artistService: TrackService) {
    super(artistService);
  }

  isValidCreateDto(dto: any): boolean {
    return isValidTrackDto(dto);
  }

  isValidUpdateDto(dto: any): boolean {
    return isValidTrackDto(dto);
  }
}
