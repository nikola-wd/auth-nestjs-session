import { Controller, Post, Body } from '@nestjs/common';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { AuthService } from './auth.service';
import {
  RegisterUserDto,
  PasswordResetLinkRequestDto,
  LoginUserDto,
} from './dtos';
import { Tokens } from './types';

@Controller(`${ApiPrefix.V1}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/register')
  async registerLocal(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<Tokens> {
    await this.authService.registerLocal(registerUserDto);

    return {
      // TODO: create service and write logic
      ...registerUserDto,
    };
  }

  @Post('local/login')
  signinLocal(@Body() loginUserDto: LoginUserDto) {
    this.authService.signinLocal();

    // TODO: create service and write logic

    return {
      ...loginUserDto,
    };
  }

  @Post('logout')
  logout() {
    this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    this.authService.refreshTokens();
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
