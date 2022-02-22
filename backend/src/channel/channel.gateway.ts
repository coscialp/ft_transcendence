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
  @WebSocketServer() 
  private server: Server;
  private logger: Logger = new Logger('ChannelGateway');
  private mutedUser: {user: string, time: number}[];
  private activeChannel: Map<string, Channel>;

  private onlineUsers: Array<{user: User, socketId: string}>;

  constructor(
  private channelService: ChannelService,
    private userService: UserService,
  ) {
    this.activeChannel = new Map<string, Channel>();
    this.mutedUser = [];
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
      let mutedUserIndex: number = this.mutedUser.findIndex((u) => u.user === user.username);
      
      
      if (mutedUserIndex !== -1) {
        if (this.mutedUser[mutedUserIndex].time + 1 <= new Date().getMinutes() || (this.mutedUser[mutedUserIndex].time > new Date().getMinutes() && this.mutedUser[mutedUserIndex].time !== 70)) {
          this.mutedUser.splice(mutedUserIndex, 1);
          
          mutedUserIndex = this.mutedUser.findIndex((u) => u.user === user.username);
        }
      }
      if (mutedUserIndex === -1) {
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

    const toId = this.onlineUsers.find((u) => u.user.username === data.receiver).socketId;
    this.server.to(toId).emit('private_message', response);
  }

  @SubscribeMessage('mute_user')
  async muteUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.mutedUser.push({user: data.mutedUser, time: new Date().getMinutes()});
    this.server.emit(`mute_user/${data.receiver}`, data.timeMuted);
  }

  @SubscribeMessage('unmute_user')
  async unmuteUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    this.mutedUser.slice(this.mutedUser.findIndex((u) => u.user === user.username), 1);
  }

  @SubscribeMessage('ban_user')
  async banUser(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    
    const admin: User = await this.userService.getUserById(data.id);
    this.channelService.demoteToPeon(admin, channel);
    this.mutedUser.push({user: data.id, time: 70});
  }

  @SubscribeMessage('promote_admin')
  async promoteAdmin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    
    const admin: User = await this.userService.getUserById(data.id);
    this.channelService.promoteToAdmin(admin, channel);
  }

  @SubscribeMessage('demote_admin')
  async demoteAdmin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    
    const admin: User = await this.userService.getUserById(data.id);
    this.channelService.demoteToPeon(admin, channel);
  }

  @SubscribeMessage('get_admin')
  async getAdmin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    
    let channel: Channel = await this.channelService.getOneChannel(data.channelName);
    this.server.emit('admin', channel.admin);
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
