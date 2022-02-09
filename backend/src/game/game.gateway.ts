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
    private usersInQueue: User[];
    private MatchInProgress: {
        user1: User,
        user2: User,
        gameID: number,
        ranked: boolean,
    }[];
    constructor(
        private readonly gameService: GameService,
    ) {
        this.usersInQueue = [];
        this.MatchInProgress = [];
    }
    getId(MatchInProgress: { user1: User, user2: User, gameID: number }[], user: User) {
        for (let { user1, user2, gameID } of this.MatchInProgress) {
            if (user1.username === user.username || user2.username === user.username) {
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
        console.log(this.usersInQueue);
        for (let u of this.usersInQueue) {
            if (user.username !== u.username) {
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.MatchInProgress.push({ user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: false });
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
        if (!this.usersInQueue.find((u) => u.id === user.id)) {
            this.usersInQueue.push(user);
        }
        for (let u of this.usersInQueue) {
            if (user.username !== u.username) {
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.MatchInProgress.push({ user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: true });
                this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                this.usersInQueue.splice(this.usersInQueue.indexOf(user), 1);
            }
        }
    }
    @SubscribeMessage('ReadyUp')
    ReadyUp(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`ReadyUp/${data.gameId}`, data.player);
    }

    @SubscribeMessage('getGameID')
    async getOpponent(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string, id: number): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        for (let { user1, user2, gameID } of this.MatchInProgress) {
            if (user1.username === user.username || user2.username === user.username) {
                this.server.emit(`getGameID/${user.username}`, gameID);
            }
        }
    }
    @SubscribeMessage('getSpectateID')
    getSpectateID(
        @MessageBody() data: any) {
        for (let { user1, user2, gameID } of this.MatchInProgress) {
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
        let gameToDelete = this.MatchInProgress.findIndex(u => u.user1.username === user.username);
        if (gameToDelete === -1) {
            gameToDelete = this.MatchInProgress.findIndex(u => u.user2.username === user.username);
        }
        if (gameToDelete !== -1) {
            this.server.emit(`finishGame/${data.gameId}`, data.score1, data.score2, this.MatchInProgress[gameToDelete].user1, this.MatchInProgress[gameToDelete].user2, false);
                this.gameService.createGame({
                player1: this.MatchInProgress[gameToDelete].user1,
                player2: this.MatchInProgress[gameToDelete].user2,
                score1: data.score1,
                score2: data.score2,
                date: Date(),
                ranked: "false",
            })
            this.MatchInProgress.splice(gameToDelete, 1);
        }
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
        @MessageBody() data: any) {

        this.server.emit(`SetPosition/${data.gameId}`, data.pos, data.id);
    }

    @SubscribeMessage('SetPosSpectate')
    SetPosSpectate(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {

        this.server.emit(`SetPosSpectate/${data.gameId}`, data.pos, data.id);
    }

    @SubscribeMessage('StartParticle')
    StartParticle(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
            console.log(`StartParticle/${data.gameId}`)
        this.server.emit(`StartParticle/${data.gameId}`);
    }
    @SubscribeMessage('SetBallPosSpectate')
    SetBallPosSpectate(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`SetBallPosSpectate/${data.id}`, data.posx, data.posy);
    }

    @SubscribeMessage('SetBallPos')
    SetBallPos(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`SetBallPos/${data.id}`, data.posx, data.posy);
    }

    async afterInit(server: Server) {
        this.logger.log('Init');
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        try {
            this.logger.log(`Client ${user.username} disconnected`);
            let index = this.MatchInProgress.findIndex(m => m.user1.username === user.username);
            let loser = "Player1";
            if (index === -1) {
                index = this.MatchInProgress.findIndex(m => m.user2.username === user.username)
                loser = "Player2";
            }
            this.MatchInProgress.slice(index, 1);
            console.log('--------------------------');
            console.log(index);
            if (index !== -1)
            this.server.emit(`finishGame/${this.MatchInProgress[index].gameID}`, loser);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        try {
            this.logger.log(`Client ${user.username} connected`);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
