import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
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

@Injectable()
@UseGuards(AuthGuard())
export class ChannelService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(ChannelsRepository) private readonly channelsRepository: ChannelsRepository,
    @InjectRepository(MessagesRepository) private readonly messagesRepository: MessagesRepository
    ) {}

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
        ? await this.channelsRepository.findOne(id)
        : await this.channelsRepository.findOne({ name: id });
      if (!found) throw new NotFoundException(`Channel ${id} not found`);

      return found;
  }

  async createMessage(user: User, message: MessagesDto): Promise<void> {
    return this.messagesRepository.createMessage(user, message, this.userService);
  }
}
