import { Injectable } from '@nestjs/common';
import db from 'src/utils/database/DB';

@Injectable()
export class GetFavsService {
  findAll() {
    return db.favourites;
  }
}
