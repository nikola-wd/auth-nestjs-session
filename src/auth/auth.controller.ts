import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Get,
  Req,
} from '@nestjs/common';

import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { AuthService } from './auth.service';
import { GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';
import {
  RegisterUserDto,
  PasswordResetLinkRequestDto,
  LoginUserDto,
} from './dtos';
import { Tokens } from './types';
import { CookieOptions, Response } from 'express';
import { JwtMaxAge } from 'src/utils/enums/JwtMaxAge';
import { Cookies } from 'src/common/decorators/cookies.decorator';

const HTTP_ONLY_COOKIE_CONF: CookieOptions = {
  // TODO: Maybe 1000 is not needed if it's in seconds and not in ms
  maxAge: JwtMaxAge.Refresh * 1000,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  // signed: true,
  // TODO: Move to .env
  // domain: 'http://localhost:3000',
  path: '/',
  // domain: '*',
};

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
    // TODO: Move 'jwt' cookie name to constants
    res.cookie('jwt', tokens.refresh_token, HTTP_ONLY_COOKIE_CONF);

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
    res.cookie('jwt', tokens.refresh_token, HTTP_ONLY_COOKIE_CONF);

    return {
      access_token: tokens.access_token,
    };
  }

  // TODO: should clear cookie as well
  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  // and send correct status: 204?;
  // TODO: Clear cookie here as well
  // It expects: authorization: Bearer access_token (check for Authorization and authorization)
  @Get('local/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  // TODO: Test tokens with less time to verify they expire
  // TODO: Make this route Get(), and read the token from the cookie
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('local/refresh')
  refreshTokens(@Cookies('jwt') refreshToken: string) {
    console.log(
      '========================REFRESH TOKEN AUTH CONTROLLER =============================',
      refreshToken,
    );

    // TODO: store refresh in cookie and return only access
    return this.authService.refreshTokens(refreshToken);
  }

  // TODO: Implement
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
