import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { ChannelsRepository } from './channels.repository';

@Injectable()
@UseGuards(AuthGuard())
export class ChannelService {
  constructor(
    private readonly authService: AuthService,
    private readonly channelsRepository: ChannelsRepository
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
    return this.channelsRepository.createChannel(user, name, password);
  }
}
