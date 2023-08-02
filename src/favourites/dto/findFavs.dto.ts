import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindFavsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
