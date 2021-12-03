import { Body, Controller, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { Auth42Dto } from './dto/auth-42.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Post('/api42/signin')
  async signIn42(@Query() auth42Dto: Auth42Dto): Promise<{ accessToken: string }> {
    return await this.authService.signIn42(auth42Dto);
  }

  @UseGuards(AuthGuard())
  @Patch('/logout')
  async logout(@GetUser() user: User): Promise<void> {
    return await this.authService.logout(user);
  }
}
