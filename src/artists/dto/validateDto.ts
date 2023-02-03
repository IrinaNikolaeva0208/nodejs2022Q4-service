export default function isValidArtistDto(dto) {
  return (
    dto &&
    'name' in dto &&
    'grammy' in dto &&
    Object.keys(dto).length == 2 &&
    typeof dto.name == 'string' &&
    typeof dto.grammy == 'boolean'
  );
}
