import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsString()
  firstName?: string | null;

  @IsString()
  lastName?: string | null;

  @IsString()
  nickName?: string | null;

  @IsString()
  profileImage: string | null;

  @IsString()
  email: string | null;
}
