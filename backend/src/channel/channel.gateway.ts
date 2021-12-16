import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { parse } from 'cookie';
import { ChannelService } from './channel.service';
import { User } from 'src/user/user.entity';

@WebSocketGateway(5001, { transports: ['websocket'] })
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChannelGateway');

  constructor(
    private channelService: ChannelService,
  ) {}

  @SubscribeMessage('msg_toServer')
  async handleMessage(@MessageBody() message: any, @ConnectedSocket() socket: Socket): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.logger.log(message);
    const response = {
      sentAt: message.sentAt,
      sender: user.username,
      body: message.body,
      avatar: user.profileImage
    }
    this.server.emit('msg_toClient', response);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.logger.log(`Client ${user.username} disconnected`);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.logger.log(`Client ${user.username} connected!`);
  }
}
