export default function isValidUserUpdateDto(dto) {
  return (
    dto &&
    'oldPassword' in dto &&
    'newPassword' in dto &&
    Object.keys(dto).length == 2 &&
    typeof dto.oldPassword == 'string' &&
    typeof dto.newPassword == 'string'
  );
}
