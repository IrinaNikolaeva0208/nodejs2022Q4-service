import { validate } from 'uuid';

export default function isValidAlbumDto(dto: any) {
  return (
    dto &&
    'name' in dto &&
    'year' in dto &&
    'artistId' in dto &&
    Object.keys(dto).length == 3 &&
    typeof dto.name == 'string' &&
    typeof dto.year == 'number' &&
    (validate(dto.artistId) || dto.artistId === null)
  );
}
