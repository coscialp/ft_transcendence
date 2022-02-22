import {
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Socket, Server } from 'socket.io';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from './notifications.service';
import { emit } from 'process';
  
  @WebSocketGateway(5003, { transports: ['websocket'] })
  export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;
    private logger: Logger = new Logger('NotificationsGateway');
    private onlineUsers: Array<{user: User, socketId: string}>;

    
    constructor(
      private readonly notificationsService: NotificationsService
    ) {
      this.onlineUsers = new Array();
    }


    afterInit(server: Server) {
        this.logger.log('Init');
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

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
      const user: User = await this.notificationsService.getUserFromSocket(socket);
      this.removeUser(socket.id);
      try {
        this.logger.log(`Client ${user.username} disconnected`);
      } catch (error) {
        this.logger.error(error);
      }
    }
  
    async handleConnection(@ConnectedSocket() socket: Socket) {
      const user: User = await this.notificationsService.getUserFromSocket(socket);
  
      this.addUser(user, socket.id);
      try {
        this.logger.log(`Client ${user.username} connected`);
      } catch (error) {
        this.logger.error(error);
      }
    }
    

    @SubscribeMessage('newNotification')
    async handleMessage(
      @MessageBody() data: any,
      @ConnectedSocket() socket: Socket,  
    ): Promise<void> {
      const user: User = await this.notificationsService.getUserFromSocket(socket);

      
      const toId = this.onlineUsers.find((u) => u.user.username === data.receiver).socketId;
      this.server.to(toId).emit('newNotification');
    }

    @SubscribeMessage('updateProfileImg')
    async updateProfileImg(
      @MessageBody() data: any,
      @ConnectedSocket() socket: Socket,
    ): Promise<void> {
      const user: User = await this.notificationsService.getUserFromSocket(socket);
      this.server.to(socket.id).emit('updateProfileImg', data.path);
    }

}