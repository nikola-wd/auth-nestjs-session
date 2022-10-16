import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(3)
  content: string;
}

export class CreatePostDto {
  @IsNotEmpty()
  @MinLength(3)
  slug: string;

  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(3)
  content: string;
}
