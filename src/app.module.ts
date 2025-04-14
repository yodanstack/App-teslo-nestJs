import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductModule } from './product/product.module';
import { SeedModule } from './seed/seed.module';
import { PaginationDto } from './common/dtos/pagination.dto';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,

      logging: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api']
    }),
    ProductModule,
    PaginationDto,
    SeedModule,
    FilesModule,
    AuthModule
  ],
})
export class AppModule {}
