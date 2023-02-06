import { Module } from '@nestjs/common';
import { GetFavsController } from './getFavs.controller';
import { GetFavsService } from './getFavs.service';

@Module({
  controllers: [GetFavsController],
  providers: [GetFavsService],
})
export class GetFavsModule {}
