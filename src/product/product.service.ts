import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { isUUID } from 'class-validator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { title } from 'process';

@Injectable()
export class ProductService {
  
  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}


  async create(createProductDto: CreateProductDto) {
  
    try {
      // if(!createProductDto.slug){
      //   createProductDto.slug = createProductDto.title
      //   .toLocaleLowerCase()
      //   .replaceAll('','_')
      //   .replaceAll("'",'')
      // }else{
      //   createProductDto.slug = createProductDto.title
      //   .toLocaleLowerCase()
      //   .replaceAll('','_')
      //   .replaceAll("'",'')        
      // }

      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto)

      return producto;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {

    let product: Product | null = null;
    
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:Number(term)});
    }else{
      // product = await this.productRepository.findOneBy({slug:term});
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =: title or slug =: slug', {
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase()
      }).getOne();
    }
    // const product = await this.productRepository.findOneBy({ id: Number(id) }); 
    if(!product){
      throw new NotFoundException(`Product whit id: "${term}" not found`);
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
     const product = await this.productRepository.preload({
      id: +id,
      ...updateProductDto
     });
     if(!product){
      throw new NotFoundException(`product with id "${id}" not found`)
     }

     try {
       await this.productRepository.save(product);
       return product;
      
     } catch (error) {
      this.handleExceptions(error);
     }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleExceptions(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail)
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error check server error`);
  }
}
