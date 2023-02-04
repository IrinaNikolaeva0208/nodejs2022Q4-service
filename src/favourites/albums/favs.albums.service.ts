import { Injectable } from '@nestjs/common';
import { FavsEntityService } from '../utils/entity.service';

@Injectable()
export class FavsAlbumsService extends FavsEntityService {
  route = 'albums';
}
