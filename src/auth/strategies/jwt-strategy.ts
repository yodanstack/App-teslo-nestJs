import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { UnauthorizedException, Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interfaces";


@Injectable ()
export class JwtStrategy extends PassportStrategy(Strategy){
    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configSevice: ConfigService
        
    ){
        const jwtSecret = configSevice.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the configuration');
        }

        super({
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }
    
    async validate( payload: JwtPayload): Promise<User> {

        const {id} = payload; 

        const user = await this.userRepository.findOneBy({id})

        if(!user) throw new UnauthorizedException('Token no valid')

        if(!user?.isActive) throw new UnauthorizedException('user is inactivate, talk with admin')

        return user;
    }

}