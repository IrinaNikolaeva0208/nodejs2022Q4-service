export default function isValidUserCreateDto(dto) {
  return (
    dto &&
    'login' in dto &&
    'password' in dto &&
    Object.keys(dto).length == 2 &&
    ['string', 'null'].includes(typeof dto.login) &&
    typeof dto.password == 'string'
  );
}
