import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  artistId: string | null;
}
