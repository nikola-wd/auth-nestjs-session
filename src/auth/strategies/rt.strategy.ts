import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

// TODO: Maybe we need to check if token is valid and compare to the DB one here
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(
            '_________________________RT STRATEGY______________',
            request,
          );

          const token = request?.cookies['jwt'];

          console.log('token________________', token);
          console.log('COOKIES: ', request?.cookies);

          if (!token) {
            return null;
          }
          return token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    console.log('PATYLOAD:>>>>', payload);

    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
