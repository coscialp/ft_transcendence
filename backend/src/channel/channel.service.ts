import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { ChannelsRepository } from './channels.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Channel } from './channel.entity';
import { UserController } from 'src/user/user.controller';
import { MessagesDto } from './dto/messages.dto';
import { MessagesRepository } from './messages.repository';
import { UsersRepository } from 'src/user/user.repository';
import { Message } from './message.entity';

@Injectable()
@UseGuards(AuthGuard())
export class ChannelService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(ChannelsRepository) private readonly channelsRepository: ChannelsRepository,
    @InjectRepository(MessagesRepository) private readonly messagesRepository: MessagesRepository,

    ) {}


  async getChannel() {
    return await this.channelsRepository.getChannel();
  }

  async getUserFromSocket(socket: Socket): Promise<User> {
    const cookies = socket.handshake.headers.cookie;
    const { access_token } = parse(cookies);
    return await this.authService.getUserFromAuthenticationToken(access_token);
  }

  async createChannel(
    user: User,
    name: string,
    password: string,
  ): Promise<void> {
    return this.channelsRepository.createChannel(user, name, password, this.userService);
  }

  private isUUID(id: string): Boolean {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
  }

  async getOneChannel(id: string): Promise<Channel> {
    let found: Channel = this.isUUID(id)
        ? (await this.getChannel()).find((channel) => channel.id === id)
        : (await this.getChannel()).find((channel) => channel.name === id);
      if (!found) throw new NotFoundException(`Channel ${id} not found`);

      return found;
  }

  async createMessage(user: User, message: MessagesDto): Promise<void> {
    return await this.messagesRepository.createMessage(user, message);
  }

  async joinChannel(user: User, name: string, password: string): Promise<void> {
    let channel = await this.getOneChannel(name);
    
    return await this.channelsRepository.joinChannel( await this.userService.getUserById(user.id, user), channel)
  }

  async getMessageByChannel(name: string): Promise<{messages: Message[]}> {
    const allMessages = await this.messagesRepository.getMessages();
    
    let messages: Message[] = [];
    for (let message of allMessages) {
      if (message.channel.name === name) {
        messages.push(message);
      }
    }
    console.log(messages);
    return { messages };
  }
}
