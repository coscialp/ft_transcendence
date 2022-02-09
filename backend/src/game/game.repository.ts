import { InjectRepository } from "@nestjs/typeorm";
import { UsersRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { EntityRepository, Repository } from "typeorm";
import { GameHistoryDto } from "./dto/game-history.dto";
import { Game } from "../entities/game.entity";
import { User } from "src/entities/user.entity";

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    constructor(
        @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    ) {
        super();
      }

      async updatePlayer(game: Game, player1: User, player2: User, userService: UserService) {
        player1.games = (await userService.getGames(player1)).games;
        player1.games.push(game);

        player2.games = (await userService.getGames(player2)).games;
        player2.games.push(game);

        if (game.ranked) {
            player1.RankedGameNumber += 1;
            player2.RankedGameNumber += 1;

            if (game.score1 > game.score2) {
                player1.PP += Math.abs(game.score1 - game.score2);
                player1.RankedWinNumber += 1;
            } else {
                player2.PP += Math.abs(game.score1 - game.score2);
                player2.RankedWinNumber += 1;
            }
        } else {
            player1.NormalGameNumber += 1;
            player2.NormalGameNumber += 1;

            if (game.score1 < game.score2) {
                player1.NormalGameNumber += 1;
            } else {
                player2.NormalGameNumber += 1;
            }
        }

        player1.GoalSet += game.score1;
        player1.GoalTaken += game.score2;

        player2.GoalSet += game.score2;
        player2.GoalTaken += game.score1;

      }

      async createGame(
          gameHistoryDto: GameHistoryDto,
          userService: UserService,
        ) {
        const {
            player1,
            player2,
            score1,
            score2,
            date,
            ranked,
        } = gameHistoryDto;
        
        if (ranked) {
            player1.RankedGameNumber += 1;
            player2.RankedGameNumber += 1;

            if (score1 > score2) {
                player1.PP += 10 + Math.abs(score1 - score2);
                player2.PP -= 10 + Math.abs(score1 - score2);
                player1.RankedWinNumber += 1;
            } else {
                player2.PP += 10 + Math.abs(score1 - score2);
                player1.PP -= 10 + Math.abs(score1 - score2);
                player2.RankedWinNumber += 1;
            }
        } else {
            player1.NormalGameNumber += 1;
            player2.NormalGameNumber += 1;

            if (score1 < score2) {
                player1.NormalWinNumber += 1;
            } else {
                player2.NormalWinNumber += 1;
            }
        }

        player1.GoalSet += score1;
        player1.GoalTaken += score2;

        player2.GoalSet += score2;
        player2.GoalTaken += score1;


        const game: Game = this.create({
            player1,
            player2,
            score1,
            score2,
            date,
            ranked,
        });
        
        player1.games = (await userService.getGames(player1)).games;
        player1.games.push(game);

        player2.games = (await userService.getGames(player2)).games;
        player2.games.push(game);

        // await this.updatePlayer(game, player1, player2, userService);

        try {
            await this.usersRepository.save(player1);
            await this.usersRepository.save(player2);
            await this.save(game);
        } catch (error) {
            console.log(error.code);
        }

      }

      async getGames() {
        const query = this.createQueryBuilder('game')
        .leftJoinAndSelect('game.player1', 'player1')
        .leftJoinAndSelect('game.player2', 'player2');

        return await query.getMany();
      }
}