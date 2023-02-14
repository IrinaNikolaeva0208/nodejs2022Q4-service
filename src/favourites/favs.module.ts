import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Favourites } from './entities/favs.entity';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [TypeOrmModule.forFeature([Favourites])],
  exports: [FavsService],
})
export class FavsModule {}
