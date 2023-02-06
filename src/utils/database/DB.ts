import { Database } from './database.interface';

const db: Database = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favourites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};

export default db;
