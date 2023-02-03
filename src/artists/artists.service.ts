import { Injectable } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { v4 } from 'uuid';
import { ArtistDto } from './dto/artist.dto';
import { Service } from 'src/utils/classes/service';

@Injectable()
export class ArtistService extends Service {
  route = 'artists';
}
