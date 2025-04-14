import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductService } from 'src/product/product.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService,
    private readonly productServie: ProductService
  ) {}

  @ApiTags('Seed')
  @Get()
  executeSeed(){
    return this.seedService.runSeed();
  }
}
