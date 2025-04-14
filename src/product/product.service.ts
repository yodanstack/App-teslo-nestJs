import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Delete } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { isUUID } from 'class-validator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductService {
  
  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    
    @InjectRepository(ProductImage)
    private readonly  productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}


  async create(createProductDto: CreateProductDto, user: User) {
  
    try {
      
      const {images = [], ...productDeatils } = createProductDto;

      const producto = this.productRepository.create({
      
        ...productDeatils,
        user,
        images: images.map(image => this.productImageRepository.create({url: image})),
        });
      await this.productRepository.save(producto)

      return {...producto, images: images, user};

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });
    return products.map(product => ({
      ...product,
      images: product.images?.map(img => img.url)
    }));
  }

  async findOne(term: string) {

    let product: Product | null = null;
    
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:Number(term)});
    }else{
      // product = await this.productRepository.findOneBy({slug:term});
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('UPPER(title) =: title or slug =: slug', {
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase(),
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }
    // const product = await this.productRepository.findOneBy({ id: Number(id) }); 
    if(!product){
      throw new NotFoundException(`Product whit id: "${term}" not found`);
    }
    return product
  }

  async findOnePlain(term: string){
    const { images = [], ...res} = await this.findOne(term);

    return {
      ...res,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...toUpdate} = updateProductDto;

     const product = await this.productRepository.preload({id: Number(id), ...toUpdate});
     if(!product) throw new NotFoundException(`product with id "${id}" not found`)
      
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      

     try {
      if(images) {
        await queryRunner.manager.delete(ProductImage, { product: { id: Number(id) } });
        product.images = images.map(image => this.productImageRepository.create({url: image}))
      }

      product.user = user;
      await queryRunner.manager.save(product);

      //  await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
       return this.findOnePlain(id);
      
     } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async deleteAllProduct(){
    const query = this.productRepository.createQueryBuilder('product');
    
    try {

      return await query.delete().where({}).execute()
      
    } catch (error) {
      this.handleExceptions(error);
    }
  } 
}
