import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { REGEXSPS } from 'src/utils/REGEXPS';

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
  @Matches(REGEXSPS.Username, {
    message:
      'Make sure only lowercase alphanumeric characters, underscores and dots are used',
  })
  username: string;

  @IsNotEmpty()
  @Matches(REGEXSPS.Password, {
    message:
      'The password must be in this format: 6 - 16 characters; Minimum 1 of each: uppercase, lowercase, number, special character',
  })
  password: string;
}

export class PasswordResetLinkRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
