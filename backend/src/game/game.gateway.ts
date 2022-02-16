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
import { User } from 'src/entities/user.entity';
import { GameService } from './game.service';

@WebSocketGateway(5002, { transports: ['websocket'], "pingInterval": 5000, "pingTimeout": 20000 })
export class GameGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');
    private connectedUser: {user: User, socketId: string}[];
    private usersInQueue: User[];
    private usersInRankedQueue: {user: User, pool: number}[];
    private matchInProgress: {
        user1: User,
        user2: User,
        gameID: number,
        ranked: boolean,
    }[];
    constructor(
        private readonly gameService: GameService,
    ) {
        this.usersInQueue = [];
        this.usersInRankedQueue = [];
        this.matchInProgress = [];
        this.connectedUser = [];
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
                this.matchInProgress.push({ user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: false });
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                this.usersInQueue.splice(this.usersInQueue.indexOf(user), 1);
            }
        }
    }
    @SubscribeMessage('matchmakingRanked')
    async MatchMakingRanked(
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        if (this.usersInRankedQueue.findIndex((u) => u.user.id === user.id) === -1) {
            this.usersInRankedQueue.push({user: user, pool: 100});
        }
        else {
            this.usersInRankedQueue[this.usersInRankedQueue.findIndex((u) => u.user.id === user.id)].pool += 25;
        }
        for (let {user: u, pool: pool} of this.usersInRankedQueue) {
            if (user.username !== u.username && Math.abs(u.PP - user.PP) - pool <= 0) {
                this.matchInProgress.push({ user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: true });
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.usersInRankedQueue.splice(this.usersInRankedQueue.findIndex((j) => j.user.id === u.id), 1);
                this.usersInRankedQueue.splice(this.usersInRankedQueue.findIndex((j) => j.user.id === user.id), 1);
            }
        }
    }
    @SubscribeMessage('ReadyUp')
    ReadyUp(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`ReadyUp/${data.gameId}`, data.player);
        this.server.to('')
    }

    @SubscribeMessage('getGameID')
    async getOpponent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string, id: number): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        for (let { user1, user2, gameID } of this.matchInProgress) {    
            if (user1.username === user.username) {
                this.server.emit(`getGameID/${user.username}`, gameID);
            }
            else if (user2.username === user.username){
                this.server.emit(`getGameID/${user.username}`, gameID);
            }
        }
    }
    @SubscribeMessage('getSpectateID')
    getSpectateID(
        @MessageBody() data: any) {
        for (let { user1, user2, gameID } of this.matchInProgress) {
            if (user1.username === data.username || user2.username === data.username) {
                this.server.emit(`getSpectateID/${data.id}`, gameID);
            }
        }
    }
    @SubscribeMessage('finishGame')
    async finishGame(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        let gameToDelete = this.matchInProgress.findIndex(u => u.user1.username === user.username);
        if (gameToDelete === -1) {
            gameToDelete = this.matchInProgress.findIndex(u => u.user2.username === user.username);
        }
        if (gameToDelete !== -1) {
            const {
                user1,
                user2,
                gameID,
                ranked,
            } = this.matchInProgress[gameToDelete];

            this.matchInProgress.splice(gameToDelete, 1);
            await this.gameService.createGame({
                player1: user1,
                player2: user2,
                score1: data.score1,
                score2: data.score2,
                date: Date(),
                ranked: ranked,
            })
            this.server.emit(`finishGame/${data.gameId}`, '');
        }
    }

    @SubscribeMessage('AddPoint')
    async AddPoint(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`AddPoint/${data.gameId}`, data.point);
    }

    @SubscribeMessage('SetPosition')
    async SetPosition(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {

        this.server.emit(`SetPosition/${data.gameId}`, data.pos, data.id);
    }

    @SubscribeMessage('UpdatePosition')
    async UpdatePosition(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.to(data.gameID).emit(`UpdatePosition`, data.pos, data.id, data.posx, data.posy);
    }

    @SubscribeMessage('StartParticle')
    async StartParticle(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`StartParticle/${data.gameId}`);
    }

    @SubscribeMessage('joinroom')
    async joinroom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        socket.join(data.gameID);
    }

    @SubscribeMessage('ExitQueue')
    async ExitQueue(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
            const user: User = await this.gameService.getUserFromSocket(socket);
            for (let {user: u, pool: pool} of this.usersInRankedQueue) {
                 
                if (user.username === u.username) {
                    
                    this.usersInRankedQueue.splice(this.usersInRankedQueue.findIndex((j) => j.user.id === u.id), 1);
                }
            }
            for (let u of this.usersInQueue) {
                if (user.username === u.username) {
                    this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                }
            }
    }
    async afterInit(server: Server) {
        this.logger.log('Init');
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        try {
            this.logger.log(`Client ${user.username} disconnected`);
            let index = this.matchInProgress.findIndex(m => m.user1.username === user.username);
            let loser = "Player1";
            if (index === -1) {
                index = this.matchInProgress.findIndex(m => m.user2.username === user.username)
                loser = "Player2";
            }
            this.matchInProgress.slice(index, 1);
            if (index !== -1) {
                this.server.emit(`finishGame/${this.matchInProgress[index].gameID}`, loser);
            }
            this.connectedUser.slice(this.connectedUser.findIndex((u) => u.user.username === user.username), 1);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        try {
            this.logger.log(`Clientux ${user.username} connected`);
            if (!this.connectedUser.some((u) => u.user.username === user.username)) {
                this.connectedUser.push({user: user, socketId: socket.id});
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
