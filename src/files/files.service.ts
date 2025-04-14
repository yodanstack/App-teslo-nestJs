import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
 
    getStaticProductImage(imageName: string){
        const path = join(__dirname, '..', '..', 'public', 'products', imageName);

        
        if(!existsSync(path)){
            throw new BadRequestException(`No product found whit image ${imageName}`);
        }

        return path;
 }
 
}
