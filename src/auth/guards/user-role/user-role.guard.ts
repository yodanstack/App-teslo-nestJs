import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRows: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if(!validRows) return true;
    if(validRows.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    
    if(!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if(validRows.includes('roles')){
        return true;
      }

      throw new ForbiddenException(`user ${user.fullName} needs a vald role ${role}`);
    }

    return true;
  }
}
