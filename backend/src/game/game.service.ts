import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

@Injectable()
@UseGuards(AuthGuard())
export class GameService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    ) {}

  async getUserFromSocket(socket: Socket): Promise<User> {
    const cookies = socket.handshake.headers.cookie;
    const { access_token } = parse(cookies);
    return await this.authService.getUserFromAuthenticationToken(access_token);
  }

}
