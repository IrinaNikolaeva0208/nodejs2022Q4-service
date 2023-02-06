import { Injectable } from '@nestjs/common';
import { Service } from 'src/utils/classes/service';
import db from 'src/utils/database/DB';
import deleteEntitiesContainingId from 'src/utils/functions/deleteEntitiesContainigId';
import { Track } from './interfaces/track.interface';

@Injectable()
export class TrackService extends Service {
  route = 'tracks';

  delete(id: string) {
    const trackToDelete = db[this.route].find((item) => item.id == id);
    if (trackToDelete) {
      deleteEntitiesContainingId<Track>(
        db[this.route],
        db.favourites[this.route],
        trackToDelete,
      );
    }
    return trackToDelete;
  }
}
