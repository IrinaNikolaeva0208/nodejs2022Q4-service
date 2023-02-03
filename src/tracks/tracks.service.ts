import { Injectable } from '@nestjs/common';
import { Service } from 'src/utils/classes/service';

@Injectable()
export class TrackService extends Service {
  route = 'tracks';
}
