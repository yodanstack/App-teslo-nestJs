import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServie: ProductService
  ){

  }

   async runSeed(){
    
    await this.insertNewProdcucts();

    return "Seed Execute"
    
   }

  private async insertNewProdcucts(){
   await this.productServie.deleteAllProduct()
  
    const seedProduct = initialData.products;

    const insertPromises: Promise<any>[] = [];

    seedProduct.forEach((product)=>{
      return insertPromises.push(this.productServie.create(product));
    });

    await Promise.all(insertPromises);

  return true;
  }

}
