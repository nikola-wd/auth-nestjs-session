import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Body,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
import { UpdatePostDto } from './dtos';
import { PostsService } from './posts.service';

@Controller(`${ApiPrefix.V1}/posts`)
export class PostsController {
  constructor(private postsService: PostsService) {}
  // Public get all posts route
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  // Used for logged in users
  @Get('by-user-id')
  @HttpCode(HttpStatus.OK)
  getPostsByUserId(@GetCurrentUserId() userId: number) {
    return this.postsService.getPostsByUserId(userId);
  }

  @Public()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  getSinglePostBySlug(@Param('slug') slug: string) {
    return this.postsService.getSinglePostBySlug(slug);
  }

  @Get('by-id/:postId')
  @HttpCode(HttpStatus.OK)
  getSinglePostById(@Param('postId', ParseIntPipe) postId: number) {
    console.log(
      '_________________POST BY ID ID: ________________________',
      postId,
    );
    return this.postsService.getSinglePostById(postId);
  }

  @Put('by-id/:postId')
  @HttpCode(HttpStatus.OK)
  updateSinglePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUserId() userId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updateSinglePost(postId, userId, updatePostDto);
  }
}
