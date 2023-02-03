import { Controller } from '@nestjs/common';
import { EntityController } from 'src/utils/classes/controller';
import { ArtistService } from './artists.service';
import isValidArtistDto from './dto/validateDto';

@Controller('artist')
export class ArtistsController extends EntityController<ArtistService> {
  constructor(private artistService: ArtistService) {
    super(artistService);
  }

  isValidCreateDto(dto: any): boolean {
    return isValidArtistDto(dto);
  }

  isValidUpdateDto(dto: any): boolean {
    return isValidArtistDto(dto);
  }
}
