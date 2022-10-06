import { Injectable, ForbiddenException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { JwtMaxAge } from 'src/utils/enums/JwtMaxAge';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  // TODO: Check if user with provided email or username already exists

  // Role may be added here
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
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: JwtMaxAge.Access,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: JwtMaxAge.Refresh,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async registerLocal(dto: RegisterUserDto): Promise<Tokens> {
    // Hash the password
    const hash = await this.hashData(dto.password);

    // Create user (if email or username already exist, throw Exreption)
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash,
      },
    });

    // Generate tokens
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.username,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    // TODO: Store refresh into http only cookie
    // and return access token that should be saved in memory
    // Should return only refresh_token and set a http cookie with the access_token
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

  // TODO: don't return access_token, store it to http only cookie instead (do the same in register and signin), return only refresh token
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashRt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.username);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
