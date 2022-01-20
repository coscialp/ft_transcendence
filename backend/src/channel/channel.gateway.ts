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
  private activeChannel: Map<User, Channel>;
  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {
    this.activeChannel = new Map<User, Channel>();
  }

  @SubscribeMessage('msg_toServer')
  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const user: User = await this.channelService.getUserFromSocket(socket);
    var   user_channel: Channel;
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
        channel: this.activeChannel.get(user),
      };
      this.channelService.createMessage(user, response);
      for (let [users, channel] of this.activeChannel)
      {
        if (user.nickName === users.nickName)
        {
          user_channel = channel;
        }
      }

      if (user_channel) {
        console.log(user_channel.creator)
        console.log(user_channel.admin)
        this.server.emit(`msg_toClient/${user_channel.name}`, response);
      } else {
        this.server.emit('msg_toClient', response);
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
    this.logger.log(data.channelName);
    this.activeChannel.set(
      user,
      await this.channelService.getOneChannel(data.channelName),
    );
    this.logger.log(`channel: ${this.activeChannel}`);
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
