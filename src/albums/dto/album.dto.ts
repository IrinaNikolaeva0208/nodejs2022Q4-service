import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlbumDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiPropertyOptional({ type: String })
  @IsUUID()
  @IsOptional()
  artistId?: string;
}
