import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

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
  @HttpCode(HttpStatus.CREATED)
  registerLocal(@Body() registerUserDto: RegisterUserDto): Promise<Tokens> {
    return this.authService.registerLocal(registerUserDto);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() loginUserDto: LoginUserDto): Promise<Tokens> {
    return this.authService.signinLocal(loginUserDto);
  }

  // TODO: move 'jwt and jet-refresh' to constants
  @UseGuards(AuthGuard('jwt'))
  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    // TODO: Implment
    this.authService.logout(user['id']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
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
