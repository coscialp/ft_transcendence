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
import { User } from 'src/user/user.entity';
import { GameService } from './game.service';

@WebSocketGateway(5002, { transports: ['websocket'] })
export class GameGateway
    implements OnGatewayInit {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');
    private usersInQueue: User[]; 
    private MatchInProgress: {
        user1: User, 
        user2: User, 
        gameID: number }[];
    constructor(
        private readonly gameService: GameService,
    ) {
        this.usersInQueue = [];
        this.MatchInProgress = [];
    }
    getId(MatchInProgress: {user1: User, user2: User, gameID: number}[], user: User)
    {
        for(let {user1, user2, gameID} of this.MatchInProgress)
        {
            if (user1.username === user.username || user2.username === user.username){
                return gameID;
            }
        }
    }
    @SubscribeMessage('matchmaking')
    async MatchMaking(
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        if (!this.usersInQueue.find((u) => u.id === user.id)) {
            this.usersInQueue.push(user);
        }
        for (let u of this.usersInQueue) {
            if (user.username !== u.username) {
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.MatchInProgress.push({user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1)});
                this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                this.usersInQueue.splice(this.usersInQueue.indexOf(user), 1);
            }
        }
    }
    @SubscribeMessage('ReadyUp')
     ReadyUp(
        @ConnectedSocket() socket: Socket,  
        @MessageBody() data: any){
        this.server.emit(`ReadyUp/${data.gameId}`, data.player);
    }

    @SubscribeMessage('getGameID')
    async getOpponent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string, id: number): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        for(let {user1, user2, gameID} of this.MatchInProgress)
        {
            if (user1.username === user.username || user2.username === user.username){
                this.server.emit(`getGameID/${user.username}`, gameID);
            }
        }
        
    }
    @SubscribeMessage('finishGame')
    finishGame(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any){
        this.server.emit(`finishGame/${data.gameId}`, data.player);
        
    }
    @SubscribeMessage('AddPoint')
    AddPoint(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`AddPoint/${data.gameId}`, data.point);
    }

    @SubscribeMessage('SetPosition')
    SetPosition(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any){
        
        this.server.emit(`SetPosition/${data.gameId}`, data.pos, data.id);
    }

    
    @SubscribeMessage('SetBallPos')
    SetBallPos(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data:any){
        this.server.emit(`SetBallPos/${data.id}`, data.posx, data.posy);
    }

    async afterInit(server: Server) {
        this.logger.log('Init');
    }
}
