import { Injectable, ForbiddenException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  // TODO: Check if user with provided email or username already exists

  async getTokens(
    userId: number,
    email: string,
    username: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
        },
        {
          // TODO: Move to conf
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async registerLocal(dto: RegisterUserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash,
      },
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.username,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }

  async signinLocal(dto: LoginUserDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      // TODO: refactor to accept username | email signin
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashRt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
