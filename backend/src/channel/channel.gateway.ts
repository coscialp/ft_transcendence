import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChannelService } from './channel.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { MessagesDto } from './dto/messages.dto';
import { Channel } from './channel.entity';

@WebSocketGateway(5001, { transports: ['websocket'] })
export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChannelGateway');
  private activeChannel: Map<string, Channel>;
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {
    this.activeChannel = new Map<string, Channel>();
  }

  @SubscribeMessage('msg_toServer')
  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    try {
      let receiver: User;

      if (message.receiver) {
        receiver = await this.userService.getUserById(message.receiver);
      }

      const response: MessagesDto = {
        sentAt: message.sentAt,
        sender: user,
        body: message.body,
        receiver,
        channel: this.activeChannel.get(user.username),
      };

      this.channelService.createMessage(user, response);

      if (response.channel) {
        this.server.emit(`msg_toClient/${response.channel.name}`, response);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('change_channel')
  async handleChangeChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.activeChannel.set(
      user.username,
      await this.channelService.getOneChannel(data.channelName),
    );
  }

  @SubscribeMessage('private_message')
  async handlePrivMessage(
    @MessageBody () data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);

    const response: MessagesDto = {
      sentAt: data.sentAt,
      sender: user,
      body: data.body,
      receiver: await this.userService.getUserById(data.receiver),
      channel: null,
    };

    this.channelService.createMessage(user, response);

    this.server.emit(`private_message/${data.receiver}`, response);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);
    try {
      this.logger.log(`Client ${user.username} disconnected`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);
    try {
      this.logger.log(`Client ${user.username} connected`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
