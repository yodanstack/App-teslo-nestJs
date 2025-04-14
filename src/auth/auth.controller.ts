import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';



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


  @Get('private')
  @UseGuards(AuthGuard)
  testingProvateRoute(
    @GetUser() user:User,
    @GetUser('email')  userEmail: string){
   
   
    return {
      ok: true,
      message: 'Hola Mundo',
      user,
      userEmail
    }
  }

  }
