import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GameHistoryDto } from './dto/game-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { Game } from '../entities/game.entity';

@Injectable()
@UseGuards(AuthGuard())
export class GameService {
  constructor(
    @InjectRepository(GameRepository) private readonly gameRepository: GameRepository,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    ) {}

  async getUserFromSocket(socket: Socket): Promise<User> {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const { access_token } = parse(cookies);
      return await this.authService.getUserFromAuthenticationToken(access_token);
    }
  }

  async createGame(gameHistoryDto: GameHistoryDto) {
      return this.gameRepository.createGame(gameHistoryDto, this.userService);
    }

  async getGames() {
    return this.gameRepository.getGames();
  }

  async getGamesByUser(user: User): Promise<{game: Game, winner: string, scoreDifference: number, PPaverage: number}[]> {
    const allGames = await this.getGames();

    const result: {game: Game, winner: string, scoreDifference: number,  PPaverage: number}[] = []
    for (let game of allGames) {
      if (game.player1.username === user.username || game.player2.username === user.username) {
        let r = {game, winner: (game.score1 > game.score2 ? game.player1.username : game.player2.username), scoreDifference: Math.abs(game.score1 - game.score2), PPaverage: game.ranked === true ? 10 + Math.abs(game.score1 - game.score2) : 0};
        result.push(r);
      }
    }
    return result;
  }

  async getLastGamesByUser(user: User): Promise<{game: Game, winner: string, scoreDifference: number,  PPaverage: number}> {
    const allGames = await this.getGamesByUser(user);

    return allGames[allGames.length - 1];
  }
}
