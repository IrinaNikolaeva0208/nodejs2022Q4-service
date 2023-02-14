import { Column, Entity } from 'typeorm';

@Entity()
export class Favourites {
  @Column()
  tracks: string[];

  @Column()
  artists: string[];

  @Column()
  albums: string[];
}
