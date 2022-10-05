import { IsEmail, IsNotEmpty } from 'class-validator';

// TODO: Implement custom validation that's same as on the frontend
// for username and password
export class RegisterUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
