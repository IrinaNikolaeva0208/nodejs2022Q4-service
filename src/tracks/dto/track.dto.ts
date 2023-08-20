import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  artistId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  albumId?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
