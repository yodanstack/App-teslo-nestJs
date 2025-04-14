import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from './decorators/auth.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-header.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser( loginUserDto);
  }

  @Get('chck-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User){

    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingProvateRoute(
    @Req() request: Express.Request,
    @GetUser() user:User,
    @GetUser('email')  userEmail: string,
    @RawHeaders() rawHeader: string[],
    ){
   

      
   
    return {
      ok: true,
      message: 'Hola Mundo',
      user,
      userEmail
    }
  }

    @Get('private2')
    // @SetMetadata('roles', ['admin','super-user'])
    @RoleProtected(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
    @UseGuards(AuthGuard(), UserRoleGuard)
    provateRoute(@GetUser() user: User){

      return{
        ok: true,
        user
      }
    }


    // @SetMetadata('roles', ['admin','super-user'])
    // @RoleProtected(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
    @Get('private3')
    @Auth(ValidRoles.admin, ValidRoles.superUser)
    @UseGuards(AuthGuard(), UserRoleGuard)
    provateRoute3(@GetUser() user: User){

      return{
        ok: true,
        user
      }
    }

  }
