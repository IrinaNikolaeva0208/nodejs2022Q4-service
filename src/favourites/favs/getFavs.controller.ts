import { Controller, Get } from '@nestjs/common';
import { GetFavsService } from './getFavs.service';

@Controller('favs')
export class GetFavsController {
  constructor(private service: GetFavsService) {}

  @Get()
  async getFavs() {
    return this.service.findAll();
  }
}
