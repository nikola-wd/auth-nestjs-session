import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getSinglePostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        createdAt: true,
        updatedAt: true,
        slug: true,
        title: true,
        content: true,
      },
    });

    if (!post) throw new NotFoundException();
    return post;
  }

  async getPostsByUserId(userId: number) {
    const postsByUserId = await this.prisma.post.findMany({
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
