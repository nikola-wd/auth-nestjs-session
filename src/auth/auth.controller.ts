import { Controller, Post, Body } from '@nestjs/common';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import {
  RegisterUserDto,
  PasswordResetLinkRequestDto,
  LoginUserDto,
} from './dtos';

@Controller(`${ApiPrefix.V1}/auth`)
export class AuthController {
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return {
      ...registerUserDto,
    };
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return {
      ...loginUserDto,
    };
  }

  @Post('request-password-reset-link')
  requestPasswordResetLink(
    @Body() passwordResetLinkRequest: PasswordResetLinkRequestDto,
  ) {
    return {
      ...passwordResetLinkRequest,
    };
  }
}
