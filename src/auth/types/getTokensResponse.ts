import { ApiProperty } from '@nestjs/swagger';

export class GetTokensResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
