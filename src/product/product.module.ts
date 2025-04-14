import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product,  ProductImage  } from './entities';
import { CommonModule } from '../common/common.module';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]),
  PaginationDto, AuthModule],
  exports:[ProductService, TypeOrmModule]
})
export class ProductModule {}
