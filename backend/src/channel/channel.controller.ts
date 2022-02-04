import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { ChannelService } from './channel.service';
import { MessagesDto } from './dto/messages.dto';

@Controller('channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  async getChannel() {
    return await this.channelService.getChannel();
  }

  @Get(':id')
  async getOneChannel(@Param('id') id: string) {
    return await this.channelService.getOneChannel(id);
  }

  @Get('messages/:name')
  async getMessageByChannel(@Param('name') name: string) {
    return await this.channelService.getMessageByChannel(name);
  }

  @Get('privmessages/:id')
  async getMessageByUser(@GetUser() user: User, @Param('id') id: string) {
    return await this.channelService.getMessageByUser(user);
  }

  @Post('create')
  async createChannel(
    @GetUser() user: User,
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<void> {
    return await this.channelService.createChannel(user, name, password);
  }

  @Post('create/message')
  async createMessage(
    @GetUser() user: User,
    @Body('message') message: MessagesDto,
  ): Promise<void> {
    return await this.channelService.createMessage(user, message);
  }

  @Patch('join/')
  async joinChannel(
    @GetUser() user: User,
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<void> {
    return await this.channelService.joinChannel(user, name, password);
  }
}
