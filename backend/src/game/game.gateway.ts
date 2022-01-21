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
    private MatchInProgress: [User, User][];
    constructor(
    private readonly gameService: GameService,
    ) {
        this.usersInQueue = [];
        this.MatchInProgress = [];
    }

    @SubscribeMessage('matchmaking')
    async MatchMaking(
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const user: User = await this.gameService.getUserFromSocket(socket);
        if (!this.usersInQueue.find((u) => u.id === user.id)) {
            this.usersInQueue.push(user);
        }
        for (let u of this.usersInQueue)
        {
            if (user.username !== u.username) {
                console.log(`startgame/${user.username}`);
                console.log(`startgame/${u.username}`);
                this.server.emit(`startgame/${user.username}`, 'Player1');
                this.server.emit(`startgame/${u.username}`, 'Player2');
                this.MatchInProgress.push([user, u]);
                this.usersInQueue.splice(this.usersInQueue.indexOf(u), 1);
                this.usersInQueue.splice(this.usersInQueue.indexOf(user), 1);
            }
        }
        console.log(this.usersInQueue);
        console.log('-------------------------------------------------------------------------')
    }

    afterInit(server: Server) {
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
