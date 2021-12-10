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
   this.logger.log(socket.handshake.headers.cookie);
   this.logger.log(`Client connected`);
  }
 }