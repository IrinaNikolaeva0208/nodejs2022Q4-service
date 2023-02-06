import { Controller } from '@nestjs/common';
import { FavsEntityController } from '../utils/entity.controller';
import { FavsAlbumsService } from './favs.albums.service';

@Controller('favs/album')
export class FavsAlbumsController extends FavsEntityController<FavsAlbumsService> {
  constructor(private favsAlbumsService: FavsAlbumsService) {
    super(favsAlbumsService);
  }
}
