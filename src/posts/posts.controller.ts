import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Post,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { PostsService } from './posts.service';

@Controller(`${ApiPrefix.V1}/posts`)
export class PostsController {
  constructor(private postsService: PostsService) {}
  // GET ALL POSTS
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  //CREATE SINGLE POST
  @Post('by-id')
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @GetCurrentUserId() userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(userId, createPostDto);
  }

  // GET SINGLE POST BY ID
  @Get('by-id/:postId')
  @HttpCode(HttpStatus.OK)
  getSinglePostById(
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUserId() userId: number,
  ) {
    console.log(
      '_________________POST BY ID ID: ________________________',
      postId,
    );
    return this.postsService.getSinglePostById(postId, userId);
  }

  // UPDATE SINGLE POST BY ID
  @Put('by-id/:postId')
  @HttpCode(HttpStatus.OK)
  updateSinglePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUserId() userId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    console.log(updatePostDto);
    return this.postsService.updateSinglePost(postId, userId, updatePostDto);
  }

  // GET ALL POSTS USER_ID
  @Get('by-user-id')
  @HttpCode(HttpStatus.OK)
  getPostsByUserId(@GetCurrentUserId() userId: number) {
    return this.postsService.getPostsByUserId(userId);
  }

  // GET SINGLE POST BY SLUG
  @Public()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  getSinglePostBySlug(@Param('slug') slug: string) {
    return this.postsService.getSinglePostBySlug(slug);
  }
}
