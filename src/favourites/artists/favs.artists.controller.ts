import { Controller } from '@nestjs/common';
import { FavsEntityController } from '../utils/entity.controller';
import { FavsArtistsService } from './favs.artists.service';

@Controller('favs/artist')
export class FavsArtistsController extends FavsEntityController<FavsArtistsService> {
  constructor(private favsArtistsService: FavsArtistsService) {
    super(favsArtistsService);
  }
}
