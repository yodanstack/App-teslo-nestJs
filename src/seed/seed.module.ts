import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductModule]
})
export class SeedModule {}
