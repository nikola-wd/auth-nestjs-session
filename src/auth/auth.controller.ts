import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';

import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { AuthService } from './auth.service';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';
import {
  RegisterUserDto,
  PasswordResetLinkRequestDto,
  LoginUserDto,
} from './dtos';
import { Tokens } from './types';
import { Response } from 'express';
import { JwtMaxAge } from 'src/utils/enums/JwtMaxAge';

@Controller(`${ApiPrefix.V1}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async registerLocal(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Partial<Tokens>> {
    const tokens = await this.authService.registerLocal(registerUserDto);
    res.cookie('jwt', tokens.refresh_token, {
      httpOnly: true,
      // TODO: Maybe 1000 is not needed if it's in seconds and not in ms
      maxAge: JwtMaxAge.Refresh * 1000,
    });

    return {
      access_token: tokens.access_token,
    };
  }

  // TODO: Disable double login if the request is being sent with access_token in headers or user hashRT already exist
  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Partial<Tokens>> {
    const tokens = await this.authService.signinLocal(loginUserDto);
    // TODO: Maybe create a helper to store a cookie
    res.cookie('jwt', tokens.refresh_token, {
      httpOnly: true,
      // TODO: Maybe 1000 is not needed if it's in seconds and not in ms
      maxAge: JwtMaxAge.Refresh * 1000,
    });

    return {
      access_token: tokens.access_token,
    };
  }

  // TODO: should clear cookie as well
  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  // and send correct status: 204?;

  // It expects: authorization: Bearer access_token (check for Authorization and authorization)
  @Get('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  // TODO: Test tokens with less time to verify they expire
  // TODO: Make this route Get()
  @Public()
  @UseGuards(RtGuard)
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    // TODO: store refresh in cookie and return only access
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
