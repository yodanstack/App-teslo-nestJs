import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from '../entities/user.entity';


export const GetUser = createParamDecorator(
        (data: string, ctx: ExecutionContext)=> {
        const req = ctx.switchToHttp().getRequest();
        const user = req.User

        if(!user) throw new InternalServerErrorException('User not found (requiest)');

        return (!data) ? user : user[data];
}


)
