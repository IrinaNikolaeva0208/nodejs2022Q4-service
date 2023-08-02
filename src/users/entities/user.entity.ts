import { Favourites } from 'src/favourites/entities/favs.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from 'src/auth/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  login: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  emailIsConfirmed: boolean;

  @Column()
  password: string;

  @ApiProperty()
  @Column()
  version: number;

  @ApiProperty()
  @Column({ type: 'bigint' })
  createdAt: number;

  @ApiProperty()
  @Column({ type: 'bigint' })
  updatedAt: number;

  @ApiProperty()
  @Column()
  role: Role;

  @OneToOne(() => Favourites, (favourites) => favourites.user)
  favourites: Favourites;

  toResponse() {
    const { password, favourites, ...userToResponse } = this;
    return userToResponse;
  }
}
