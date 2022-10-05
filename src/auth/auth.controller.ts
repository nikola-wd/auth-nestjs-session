import { Controller, Post, Body } from '@nestjs/common';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { RegisterUserDto } from './dtos/RegisterUser.dto';

@Controller(`${ApiPrefix.V1}/auth`)
export class AuthController {
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return {
      ...registerUserDto,
    };
  }
}
