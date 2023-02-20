import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class AlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
