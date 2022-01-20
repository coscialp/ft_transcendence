import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/user.entity';
import { ChannelService } from './channel.service';
import { MessagesDto } from './dto/messages.dto';

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
    console.log(`name: ${name}`);
    return this.channelService.createChannel(user, name, password);
  }

  @Post('create/message')
  async createMessage(
    @GetUser() user: User,
    @Body('message') message: MessagesDto,
  ): Promise<void> {
    return this.channelService.createMessage(user, message);
  }

  @Patch('join/')
  async joinChannel(
    @GetUser() user: User,
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<void> {
    return this.channelService.joinChannel(user, name, password);
  }
}
