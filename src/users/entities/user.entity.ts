import { Favourites } from 'src/favourites/entities/favs.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/auth/enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  emailIsConfirmed: boolean;

  @Column()
  password: string;

  @Column()
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  @Column()
  role: Role;

  @OneToOne(() => Favourites, (favourites) => favourites.user)
  favourites: Favourites;

  toResponse() {
    const { password, favourites, ...userToResponse } = this;
    return userToResponse;
  }
}
