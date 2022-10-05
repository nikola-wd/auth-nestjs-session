import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  registerLocal(dto: RegisterUserDto) {
    const newUser = this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: dto.password,
      },
    });
  }

  signinLocal(dto: LoginUserDto) {}

  logout() {}

  refreshTokens() {}
}
