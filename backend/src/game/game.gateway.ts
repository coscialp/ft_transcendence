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
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
            console.log(u.username)
            if (user.username !== u.username) {
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.MatchInProgress.push({user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1)});
                this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                this.usersInQueue.splice(this.usersInQueue.indexOf(user), 1);
            }
        }
        console.log('-------------------------------------------------------------------------')
    }
    @SubscribeMessage('ReadyUp')
    async ReadyUp(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        console.log(`ReadyUp/${this.getId(this.MatchInProgress, user)}`)
        this.server.emit(`ReadyUp/${this.getId(this.MatchInProgress, user)}`, message);
    }
    @SubscribeMessage('getGameID')
    async getOpponent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        
        console.log(this.MatchInProgress)
        for(let {user1, user2, gameID} of this.MatchInProgress)
        {
            if (user1.username === user.username || user2.username === user.username){
                console.log(gameID);
                this.server.emit(`getGameID/${user.username}`, gameID);
            }
        }
        
    }


    @SubscribeMessage('AddPoint')
    async AddPoint(
        @ConnectedSocket() socket: Socket,
        @MessageBody() Player: string): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        this.server.emit(`AddPoint/${user.username}`, Player);
    }

    @SubscribeMessage('SetPosition')
    async SetPosition(
        @ConnectedSocket() socket: Socket,
        @MessageBody() Position: number, @MessageBody() Player: string): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        console.log(`string : SetPosition/${user.username}`);
        this.server.emit(`SetPosition/${user.username}`, Position[0], Position[1]);
    }


    @SubscribeMessage('SetBallPos')
    async SetBallPos(
        @ConnectedSocket() socket: Socket,
        @MessageBody() posx: number, @MessageBody() posy: number): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        this.server.emit(`SetBallPos/${user.username}`, posx[0], posy[1]);
    }

    async afterInit(server: Server) {
        this.logger.log('Init');
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {

        try {
        } catch (error) {
            this.logger.error(error);
        }
    }
    async handleConnection(@ConnectedSocket() socket: Socket) {
        try {
        } catch (error) {
            this.logger.error(error);
        }
    }
}
