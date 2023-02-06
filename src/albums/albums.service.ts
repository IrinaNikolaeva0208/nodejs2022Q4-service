import { Injectable } from '@nestjs/common';
import { Service } from 'src/utils/classes/service';
import db from 'src/utils/database/DB';
import deleteEntitiesContainingId from 'src/utils/functions/deleteEntitiesContainigId';
import { Album } from './intefaces/album.interface';
import setIdToNull from 'src/utils/functions/setIdtoNull';

@Injectable()
export class AlbumService extends Service {
  route = 'albums';

  delete(id: string) {
    const albumToDelete = db[this.route].find((item) => item.id == id);
    if (albumToDelete) {
      deleteEntitiesContainingId<Album>(
        db[this.route],
        db.favourites[this.route],
        albumToDelete,
      );
      setIdToNull(db.tracks, id, 'albumId');
    }
    return albumToDelete;
  }
}
