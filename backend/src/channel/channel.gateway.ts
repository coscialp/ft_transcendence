import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Socket, Server } from 'socket.io';
 
 @WebSocketGateway(5001, {transports: ['websocket']})
 export class ChannelGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChannelGateway');
 
  @SubscribeMessage('msg_toServer')
  handleMessage(@MessageBody() message: string): void {
   this.logger.log(message);
   this.server.emit('msg_toClient', message);
  }
 
  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(@ConnectedSocket() socket: Socket) {
   this.logger.log(`Client disconnected`);
  }
 
  handleConnection(@ConnectedSocket() socket: Socket) {
   const cookie: string = socket.handshake.headers.cookie;

   const access_token = cookie.split('=')[4];

   console.log(access_token);
   this.logger.log(`Client connected`);
  }
 }