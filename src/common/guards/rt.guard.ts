import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}

// TODO: Test if this excepts cookie or Bearer authorization, Transform to http cookie if it accepts bearer
