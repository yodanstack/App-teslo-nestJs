import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServie: ProductService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){

  }

   async runSeed(){

    await this.deleteTable();
    
    const adminUser = await this.insertUser();
    await this.insertNewProdcucts(adminUser);

    return "Seed Execute"
    
   }


   private async deleteTable() {

    await this.productServie.deleteAllProduct();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();

   }

   private async insertUser(): Promise<User> {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    })
    const savedUsers = await this.userRepository.save(users);
    
    return savedUsers[0];
   }

  private async insertNewProdcucts(user: User){
   await this.productServie.deleteAllProduct()
  
    const seedProduct = initialData.products;

    const insertPromises: Promise<any>[] = [];

    seedProduct.forEach((product)=>{
      return insertPromises.push(this.productServie.create(product, user));
    });

    await Promise.all(insertPromises);

  return true;
  }

}
