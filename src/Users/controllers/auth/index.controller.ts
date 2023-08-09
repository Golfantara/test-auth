import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegistUserDto } from '../../dto/regist.dto';
import { AuthServices } from 'src/Users/services';
import { LoginUserDto } from 'src/Users/dto/login.dto';
import { JwtAuthGuard } from 'src/Users/guard/index.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly appServices: AuthServices) {}

  @Post('signup')
  signup(@Body() registDto: RegistUserDto) {
    return this.appServices.create(registDto);
  }

  @Post('signin')
  signin(@Body() loginDto: LoginUserDto) {
    return this.appServices.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers(@Request() req) {
    return req.user;
  }
}
