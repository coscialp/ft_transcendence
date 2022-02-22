import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { ChannelsRepository } from './channels.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Channel } from '../entities/channel.entity';
import { MessagesDto } from './dto/messages.dto';
import { MessagesRepository } from './messages.repository';
import { Message } from '../entities/message.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
@UseGuards(AuthGuard())
export class ChannelService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(ChannelsRepository)
    private readonly channelsRepository: ChannelsRepository,
    @InjectRepository(MessagesRepository)
    private readonly messagesRepository: MessagesRepository,
  ) {}

  async getChannel() {
    return await this.channelsRepository.getChannel();
  }

  async getUserFromSocket(socket: Socket): Promise<User> {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const { access_token } = parse(cookies);
      return await this.authService.getUserFromAuthenticationToken(access_token);
    }
  }

  async createChannel(
    user: User,
    name: string,
    password: string,
  ): Promise<void> {
    return this.channelsRepository.createChannel(
      user,
      name,
      password,
      this.userService,
    );
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
    return await this.messagesRepository.createMessage(user, message, this.userService, this);
  }
  async promoteToAdmin(user: User, channel: Channel): Promise<void> {
    return await this.channelsRepository.promoteToAdmin(user, channel);
  }

  async demoteToPeon(user: User, channel: Channel): Promise<void> {
    return await this.channelsRepository.demoteToPeon(user, channel);
  }

  async joinChannel(user: User, name: string, password: string): Promise<void> {
    let channel = await this.getOneChannel(name);

    if (channel && ( channel.password === "" || await bcrypt.compare(password, channel.password))) {
      return await this.channelsRepository.joinChannel(
        await this.userService.getUserById(user.id, user),
        channel, this.userService
      );
    } else {
      throw new UnauthorizedException('Wrong password');
    }
  }

  async getMessageByChannel(name: string): Promise<{ messages: Message[] }> {
    const allMessages = await this.messagesRepository.getMessages();

    let messages: Message[] = [];
    for (let message of allMessages) {
      if (message.channel && message.channel.name === name) {
        messages.push(message);
      }
    }
    return { messages };
  }

  async getMessageByUser(
    user: User,
  ): Promise<{
    messages: { property: User, conversations: Message[] }[];
  }> {
    const allMessages = await this.messagesRepository.getMessages();

    const messages: { property: User, conversations: Message[] }[] =
      [];

    for (let message of allMessages) {
      if (
        message.sender &&
        message.receiver &&
        message.sender.username === user.username &&
        !messages.find(
          (msg) => msg.property.username === message.receiver.username,
        )
      ) {
        messages.push({ property: message.receiver, conversations: [] });
      }

      if (
        message.receiver &&
        message.sender &&
        message.receiver.username === user.username &&
        !messages.find(
          (msg) => msg.property.username === message.sender.username,
        )
      ) {
        messages.push({ property: message.sender, conversations: [] });
      }
    }

    for (let message of allMessages) {
      if (message.sender && message.sender.username === user.username) {
        for (let conv of messages) {
          if (
            message.receiver &&
            message.receiver.username === conv.property.username
          ) {
            conv.conversations.push(message);
          }
        }
      } else if (
        message.receiver &&
        message.receiver.username === user.username
      ) {
        for (let conv of messages) {
          if (
            message.sender &&
            message.sender.username === conv.property.username
          ) {
            conv.conversations.push(message);
          }
        }
      }
    }

    return { messages };
  }
}
