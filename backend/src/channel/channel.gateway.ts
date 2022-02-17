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
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MessagesDto } from './dto/messages.dto';
import { Channel } from '../entities/channel.entity';

@WebSocketGateway(5001, { transports: ['websocket'] })
export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private activeChannel: Map<string, Channel>;
  private logger: Logger = new Logger('ChannelGateway');

  private onlineUsers: Array<{user: User, socketId: string}>;

  constructor(
  private channelService: ChannelService,
    private userService: UserService,
  ) {
    this.activeChannel = new Map<string, Channel>();
    this.onlineUsers = new Array();
  }


  private readonly addUser = (user: User, socketId: string) => {
    user && !this.onlineUsers.some((u) => u.user.username === user.username) &&
    this.onlineUsers.push({user, socketId});

    if (user) { 
      this.onlineUsers.find((u) => u.user.username === user.username).socketId = socketId;
    }
  }

  private readonly removeUser = (socketId: string) => {
    this.onlineUsers.filter((user) => user.socketId !== socketId);
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

    const toId = this.onlineUsers.find((u) => u.user.username === data.receiver).socketId;
    this.server.to(toId).emit('private_message', response);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.removeUser(socket.id);
    try {
      this.logger.log(`Client ${user.username} disconnected`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const user: User = await this.channelService.getUserFromSocket(socket);

    this.addUser(user, socket.id);
    try {
      this.logger.log(`Client ${user.username} connected`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
