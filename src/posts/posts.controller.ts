import { Controller, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { Cookies } from 'src/common/decorators/cookies.decorator';
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

  // getPostsByUserID(@GetCurrentUserId() userId: number) {
  //   console.log('___________________getPostsByUserID: userID: ', userId);

  //   return ['yooo'];
  //   return {
  //     posts: [],
  //     userId,
  //   };
  // }

  @Get('yo')
  @Public()
  @HttpCode(HttpStatus.OK)
  getPostsById(@Req() req: Request) {
    console.log('YOOOOOOOOOOOOOOOOOOOOOOOO');
    console.log(req);

    return ['yoooo'];
  }
}
