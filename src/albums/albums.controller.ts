import { Controller } from '@nestjs/common';
import { EntityController } from 'src/utils/classes/controller';
import { AlbumService } from './albums.service';
import isValidAlbumDto from './dto/validateDto';

@Controller('album')
export class AlbumsController extends EntityController<AlbumService> {
  constructor(private albumService: AlbumService) {
    super(albumService);
  }

  isValidCreateDto(dto: any): boolean {
    return isValidAlbumDto(dto);
  }

  isValidUpdateDto(dto: any): boolean {
    return isValidAlbumDto(dto);
  }
}
