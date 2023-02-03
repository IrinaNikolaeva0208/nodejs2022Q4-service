import db from '../database/DB';
import { v4 } from 'uuid';

export class Service {
  route = '';

  findAll() {
    return db[this.route];
  }

  findOne(id: string) {
    return db[this.route].find((item) => item.id == id);
  }

  create(dto): any {
    const id = v4();
    const newEntity = {
      ...dto,
      id: id,
    };
    db[this.route].push(newEntity);
    return newEntity;
  }

  change(id: string, dto) {
    let entityToUpdate = db[this.route].find((item) => item.id == id);
    if (entityToUpdate) entityToUpdate = { ...dto, id };
    return entityToUpdate;
  }

  delete(id: string) {
    const entityToDelete = db[this.route].find((item) => item.id == id);
    if (entityToDelete)
      db[this.route].splice(db[this.route].indexOf(entityToDelete), 1);
    return entityToDelete;
  }
}
