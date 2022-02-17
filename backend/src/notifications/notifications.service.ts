import {
    Injectable,
    NotFoundException,
    UseGuards,
  } from '@nestjs/common';
  import { Socket } from 'socket.io';
  import { parse } from 'cookie';
  import { AuthService } from '../auth/auth.service';
  import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
  
  @Injectable()
  @UseGuards(AuthGuard())
  export class NotificationsService {
    constructor(
      private readonly authService: AuthService,
    ) {}
  
    async getUserFromSocket(socket: Socket): Promise<User> {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const { access_token } = parse(cookies);
        return await this.authService.getUserFromAuthenticationToken(access_token);
      }
    }
  
  }
  