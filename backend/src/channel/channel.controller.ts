import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { ChannelService } from './channel.service';

@Controller('channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('create')
  async createChannel(
    @GetUser() user: User,
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<void> {
      return this.channelService.createChannel(user, name, password);
  }
}
