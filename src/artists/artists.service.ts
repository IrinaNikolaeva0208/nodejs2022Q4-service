import { Injectable } from '@nestjs/common';
import { Service } from 'src/utils/classes/service';
import db from 'src/utils/database/DB';
import deleteEntitiesContainingId from 'src/utils/functions/deleteEntitiesContainigId';
import { Artist } from './interfaces/artist.interface';
import setIdToNull from 'src/utils/functions/setIdtoNull';

@Injectable()
export class ArtistService extends Service {
  route = 'artists';

  delete(id: string) {
    const artistToDelete = db[this.route].find((item) => item.id == id);
    if (artistToDelete) {
      deleteEntitiesContainingId<Artist>(
        db[this.route],
        db.favourites[this.route],
        artistToDelete,
      );
      setIdToNull(db.albums, id, 'artistId');
      setIdToNull(db.tracks, id, 'artistId');
    }
    return artistToDelete;
  }
}
