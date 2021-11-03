import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Dto } from './dto/auth-42.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/api42/signin')
  signIn42(@Query() auth42Dto: Auth42Dto): Promise<{ accessToken: string }> {
    return this.authService.signIn42(auth42Dto);
  }
}
