import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  artistId: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  albumId: string | null;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
