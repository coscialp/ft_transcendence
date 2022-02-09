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
                player1.RankedWinNumber += 1;
            } else {
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

        console.log(player1);
        console.log(player2);
        console.log(ranked);

        const game: Game = this.create({
            player1,
            player2,
            score1,
            score2,
            date,
            ranked,
        });

        this.updatePlayer(game, player1, player2, userService);

        try {
            await this.save(game);
            await this.usersRepository.save(player1);
            await this.usersRepository.save(player2);
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