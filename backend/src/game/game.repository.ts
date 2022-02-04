import { InjectRepository } from "@nestjs/typeorm";
import { UsersRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { EntityRepository, Repository } from "typeorm";
import { GameHistoryDto } from "./dto/game-history.dto";
import { Game } from "./game.entity";

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    constructor(
        @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
    ) {
        super();
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

        player1.games = (await userService.getGames(player1)).games;
        player1.games.push(game);

        player2.games = (await userService.getGames(player2)).games;
        player2.games.push(game);

        try {
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