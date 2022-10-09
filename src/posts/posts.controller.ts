import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { ApiPrefix } from 'src/utils/enums/ApiPrefixes';
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

  @Get('by-user-id')
  @HttpCode(HttpStatus.OK)
  getPostsByUserId(@GetCurrentUserId() userId: number) {
    return this.postsService.getPostsByUserId(userId);
  }
}
