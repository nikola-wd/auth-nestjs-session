import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
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
      // domain: process.env.FRONTEND_DOMAIN,
    });

    return {
      access_token: tokens.access_token,
    };

    // const { access_token, refresh_token } = await tokens;

    // console.log('ACCESS_TOKEN: ', access_token);

    // res.set('Authorization', 'Bearer ' + refresh_token);

    // return {
    //   access_token,
    // };
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

  @Public()
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
