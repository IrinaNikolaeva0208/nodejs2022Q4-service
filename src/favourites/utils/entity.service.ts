import db from '../../utils/database/DB';

export class FavsEntityService {
  route = '';

  add(id: string) {
    const entityToAdd = db[this.route].find((item) => item.id == id);
    if (!entityToAdd) throw new Error();
    db.favourites[this.route].push(entityToAdd);
    return entityToAdd;
  }

  delete(id: string) {
    const entityToDeleteIndex = db.favourites[this.route].findIndex(
      (item) => item.id == id,
    );
    if (entityToDeleteIndex == -1) throw new Error();
    db.favourites[this.route].splice(entityToDeleteIndex, 1);
  }
}
