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
    private usersInModQueue: User[];
    private usersInRankedQueue: { user: User, pool: number }[];
    private usersDuel: { user1: User, user2: string }[];
    private usersConnected: { user: string, socketId: Socket }[];
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
        this.usersInModQueue = [];
        this.usersInRankedQueue = [];
        this.matchInProgress = [];
        this.usersConnected = [];
        this.usersDuel = [];
    }
    @SubscribeMessage('matchmaking')
    async MatchMaking(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any,
    ): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        if (data.mod === "gamemod") {
            if (!this.usersInModQueue.find((u) => u.id === user.id)) {
                this.usersInModQueue.push(user);
            }
            for (let u of this.usersInModQueue) {
                if (user.username !== u.username) {
                    this.matchInProgress.push({ user1: user, user2: u, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: false });
                    this.server.emit(`startgamemod/${user.username}`, 'Player1');
                    this.server.emit(`startgamemod/${u.username}`, 'Player2');
                    this.usersInModQueue.splice(this.usersInModQueue.indexOf(u), 1);
                    this.usersInModQueue.splice(this.usersInModQueue.indexOf(user), 1);
                }
            }
        }
        else {
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
    }
    @SubscribeMessage('matchmakingRanked')
    async MatchMakingRanked(
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        if (this.usersInRankedQueue.findIndex((u) => u.user.id === user.id) === -1) {
            this.usersInRankedQueue.push({ user: user, pool: 100 });
        }
        else {
            this.usersInRankedQueue[this.usersInRankedQueue.findIndex((u) => u.user.id === user.id)].pool += 25;
        }
        for (let { user: u, pool: pool } of this.usersInRankedQueue) {
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
    async ReadyUp(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.emit(`ReadyUp/${data.gameId}`, data.player);
    }

    @SubscribeMessage('duel')
    async duel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        let index: number = this.usersConnected.findIndex((u) => u.user === data.username);
        let id: string;
        if (index !== -1) {
            id = this.usersConnected[index].socketId.id;
            this.usersDuel.push({ user1: user, user2: this.usersConnected[index].user });
        }
        this.server.to(id).emit('duel', user);
    }

    @SubscribeMessage('refuse_duel')
    async refuse_duel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        let index: number = this.usersDuel.findIndex((u) => (u.user1.username) === user.username);
        if (index !== -1) {
            this.server.to(this.usersConnected[this.usersConnected.findIndex((u) => u.user === this.usersDuel[index].user2)].socketId.id).emit('refuse_duel');
            this.usersDuel.splice(index, 1);
        }
        else {
            index = this.usersDuel.findIndex((u) => (u.user2) === user.username);
            this.server.to(this.usersConnected[this.usersConnected.findIndex((u) => u.user === this.usersDuel[index].user1.username)].socketId.id).emit('refuse_duel');
            this.usersDuel.splice(index, 1);
        }
    }

    @SubscribeMessage('accept_duel')
    async accepte_duel(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        let index: number = this.usersDuel.findIndex((u) => (u.user2) === user.username);
        if (index !== -1) {
            this.matchInProgress.push({ user1: user, user2: this.usersDuel[index].user1, gameID: Math.floor(Math.random() * 2000000000 - 1), ranked: false })
            this.server.to(this.usersConnected[this.usersConnected.findIndex((u) => u.user === this.usersDuel[index].user1.username)].socketId.id).emit('accept_duel', 'Player1');
            this.server.to(socket.id).emit('accept_duel', 'Player2');
            this.usersDuel.splice(index, 1);
        }
        this.usersDuel
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
            else if (user2.username === user.username) {
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

    @SubscribeMessage('JoinRoom')
    async JoinRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        socket.join(data.gameID);
    }

    @SubscribeMessage('UpdatePosition')
    UpdatePosition(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: any) {
        this.server.to(data.gameID).emit(`UpdatePosition`, data.pos, data.id, data.posx, data.posy, data.score1, data.score2);
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
        for (let { user: u, pool: pool } of this.usersInRankedQueue) {

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
        } catch (error) {
            this.logger.error(error);
        }
    }

    async handleConnection(@ConnectedSocket() socket: Socket) {
        const user: User = await this.gameService.getUserFromSocket(socket);
        try {
            this.logger.log(`Client ${user.username} connected`);
            if (this.usersConnected.findIndex((u) => u.user === user.username) === -1) {
                this.usersConnected.push({ user: user.username, socketId: socket });
            }
            else {
                this.usersConnected.splice(this.usersConnected.findIndex((u) => u.user === user.username), 1);
                this.usersConnected.push({ user: user.username, socketId: socket });
            }
        } catch (error) {
            this.logger.error(error);
        }
    }
}
