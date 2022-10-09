import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // TODO: case where there are no posts or there is an error
  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return posts;
  }

  getPostsByUserId(userId: number) {
    const postsByUserId = this.prisma.post.findMany({
      where: {
        user: {
          id: userId,
        },
      },

      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        slug: true,
        title: true,
      },
    });

    return postsByUserId;
  }
}
