import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

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
