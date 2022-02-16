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
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChannelGateway');
  private mutedUser: string[];
  private activeChannel: Map<string, Channel>;
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {
    this.activeChannel = new Map<string, Channel>();
    this.mutedUser = [];
  }

  @SubscribeMessage('msg_toServer')
  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    try {
      let receiver: User;
      if (this.mutedUser.findIndex((u) => u === user.username) === -1) {
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
    @MessageBody() data: any,
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

  @SubscribeMessage('mute_user')
  async muteUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.mutedUser.push(data.mutedUser);
    this.server.emit(`mute_user/${data.receiver}`, data.timeBanned);
  }

  @SubscribeMessage('unmute_user')
  async unmuteUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.mutedUser.slice(this.mutedUser.findIndex((u) => u === user.username), 1);
  }

  @SubscribeMessage('promote_admin')
  async promoteAdmin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    console.log(data.id);
    const admin: User = await this.userService.getUserById(data.id);
    this.channelService.promoteToAdmin(admin, channel);
  }

  @SubscribeMessage('get_admin')
  async getAdmin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    console.log(data.channelName);
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    this.server.emit('admin', channel.admin);
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
