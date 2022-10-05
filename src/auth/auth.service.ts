import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async registerLocal(dto: RegisterUserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash,
      },
    });
  }

  signinLocal(dto: LoginUserDto) {}

  logout() {}

  refreshTokens() {}
}
