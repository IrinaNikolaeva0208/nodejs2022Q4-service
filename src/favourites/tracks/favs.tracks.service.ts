import { Injectable } from '@nestjs/common';
import { FavsEntityService } from '../utils/entity.service';

@Injectable()
export class FavsTracksService extends FavsEntityService {
  route = 'tracks';
}
