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
      // TODO: create service and write logic
      ...registerUserDto,
    };
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    // TODO: create service and write logic

    return {
      ...loginUserDto,
    };
  }

  @Post('request-password-reset-link')
  requestPasswordResetLink(
    @Body() passwordResetLinkRequest: PasswordResetLinkRequestDto,
  ) {
    // TODO: create service and write logic (connect to a mailing service)

    return {
      ...passwordResetLinkRequest,
    };
  }
}
