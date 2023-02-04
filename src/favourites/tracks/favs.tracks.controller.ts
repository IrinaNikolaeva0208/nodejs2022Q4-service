import { Controller } from '@nestjs/common';
import { FavsEntityController } from '../utils/entity.controller';
import { FavsTracksService } from './favs.tracks.service';

@Controller('favs/track')
export class FavsTracksController extends FavsEntityController<FavsTracksService> {
  constructor(private favsTracksService: FavsTracksService) {
    super(favsTracksService);
  }
}
