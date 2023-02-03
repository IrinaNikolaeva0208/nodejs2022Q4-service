import { Injectable } from '@nestjs/common';
import { Service } from 'src/utils/classes/service';

@Injectable()
export class AlbumService extends Service {
  route = 'albums';
}
