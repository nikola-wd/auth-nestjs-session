import { Controller, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators';
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

  // TODO: Remove this route and its service when done testing
  @Get('test-cookie')
  testCookie(@Req() req: Request, @Cookies() cookies: any) {
    console.log(
      '************************Cookie jwt******************************: ',
      cookies,
    );

    return ['test 1', 'test 2'];
  }
}
