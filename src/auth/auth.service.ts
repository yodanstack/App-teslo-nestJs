import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'  

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

   async create(createUserDto: CreateUserDto){
   
    try{
       const {password: userPassword, ...userDate} = createUserDto;
      
      const user = this.userRepository.create( {
        ...userDate,
        password: bcrypt.hashSync(userPassword, 10)
      } )

      await this.userRepository.save(user)
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;

      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      };
  

    }catch(error){
      this.handleDBErrors(error)
    }
  }


  checkAuthStatus(user: User){
    
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  async loginUser(loginUserDto: LoginUserDto){

    const {password, email} = loginUserDto
    
    const user = await this.userRepository.findOne({where: {email},
      select: {email: true, password: true, id: true }
    });

    if(!user) throw new UnauthorizedException(`credentials are not valid (email)`);
    

    if(!bcrypt.compareSync(password, user.password))  throw new UnauthorizedException(`credentials are not valid (password)`);

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };

  }

    private getJwtToken(payload: JwtPayload){
      const token = this.jwtService.sign(payload);

      return token

    }
  

private handleDBErrors(error: any): never {

  if(error.code === '12312') throw new BadRequestException(error.detail);

  console.log(error);

  throw new InternalServerErrorException('pleace check server logs');
}
}
