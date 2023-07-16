import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindFavsDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
