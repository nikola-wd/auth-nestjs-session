import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { AuthService } from './auth.service';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { RtGuard } from './common/guards';
import {
  RegisterUserDto,
  PasswordResetLinkRequestDto,
  LoginUserDto,
} from './dtos';
import { Tokens } from './types';

@Controller(`${ApiPrefix.V1}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  registerLocal(@Body() registerUserDto: RegisterUserDto): Promise<Tokens> {
    return this.authService.registerLocal(registerUserDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() loginUserDto: LoginUserDto): Promise<Tokens> {
    return this.authService.signinLocal(loginUserDto);
  }

  // TODO: move 'jwt and jet-refresh' to constants
  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    // TODO: Implment
    this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
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
