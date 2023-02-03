import { validate } from 'uuid';

export default function isValidAlbumDto(dto: any) {
  return (
    dto &&
      'name' in dto &&
      'duration' in dto &&
      'artistId' in dto &&
      'albumId' in dto &&
      Object.keys(dto).length == 4 &&
      typeof dto.name == 'string' &&
      typeof dto.duration == 'number' &&
      (validate(dto.artistId) || dto.artistId === null),
    validate(dto.albumId) || dto.albumId === null
  );
}
