import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductService } from 'src/product/product.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService,
    private readonly productServie: ProductService
  ) {}


  @Get()
  executeSeed(){
    return this.seedService.runSeed();
  }
}
