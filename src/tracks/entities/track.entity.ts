import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  artistId: string | null;

  @Column()
  albumId: string | null;

  @Column()
  duration: number;
}
