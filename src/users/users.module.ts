import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FavsModule } from 'src/favourites/favs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FavsModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
