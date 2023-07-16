import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService],
  imports: [TypeOrmModule.forFeature([Artist])],
  exports: [ArtistService],
})
export class ArtistsModule {}
