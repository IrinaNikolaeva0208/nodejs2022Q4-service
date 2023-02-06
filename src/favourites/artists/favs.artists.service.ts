import { Injectable } from '@nestjs/common';
import { FavsEntityService } from '../utils/entity.service';

@Injectable()
export class FavsArtistsService extends FavsEntityService {
  route = 'artists';
}
