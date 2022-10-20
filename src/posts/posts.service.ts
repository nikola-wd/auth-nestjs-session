import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dtos';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // TODO: case where there are no posts or there is an error
  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
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

  async createPost(userId: number, dto: CreatePostDto) {
    console.log('userId: ', userId);
    console.log('createPostDto: ', dto);

    try {
      await this.prisma.post.create({
        data: {
          slug: dto.slug,
          title: dto.title,
          content: dto.content,
          userId,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'Slug already taken. Please choose another one.',
        );
      }
    }
  }

  // TODO: Maybe selects are not needed since we are fetching all data

  async getSinglePostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
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

  async getSinglePostById(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException();
    if (post.userId !== userId) throw new ForbiddenException();

    delete post.userId;

    return post;
  }

  async getPostsByUserId(userId: number) {
    const postsByUserId = await this.prisma.post.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      orderBy: {
        updatedAt: 'desc',
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

  // TODO: For both don't accept createdAt, and updatedAt, those should be updated from the backend
  async updateSinglePost(
    postId: number,
    userId: number,
    postNewData: UpdatePostDto,
  ) {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!foundPost) throw new ForbiddenException();
    if (userId !== foundPost.userId) throw new ForbiddenException();

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...postNewData,
        updatedAt: new Date(),
      },
    });

    delete updatedPost.userId;

    return updatedPost;
  }

  async deleteSinglePost(postId: number, userId: number) {
    const foundPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!foundPost) throw new ForbiddenException();
    if (userId !== foundPost.userId)
      throw new ForbiddenException("Forbidden. Can't delete");

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  // TODO: update, allow slug update as well if not taken already
}
