import {Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GameHistoryDto } from './dto/game-history.dto';
import { GameService } from './game.service';

@Controller('game')
@UseGuards(AuthGuard())
export class GameController {
  constructor(
      private readonly gameService: GameService,
      private readonly userService: UserService,
    ) {}

    @Post()
    async createGame(
        @Body('player1') player1: string,
        @Body('player2') player2: string,
        @Body('score1') score1: number,
        @Body('score2') score2: number,
        @Body('date') date: string,
        @Body('ranked') ranked: boolean,
        ) {

        return await this.gameService.createGame({
            player1: await this.userService.getUserById(player1),
            player2: await this.userService.getUserById(player2),
            score1,
            score2,
            date,
            ranked,
        });
    }

    @Get()
    async getGames() {
        return this.gameService.getGames();
    }

    @Get('/:id')
    async getGamesByUser(@Param('id') id: string, @GetUser() user: User) {
        const currentUser = await this.userService.getUserById(id, user);
        return this.gameService.getGamesByUser(currentUser);
    }

    @Get('/:id/last')
    async getLastGamesByUser(@Param('id') id: string, @GetUser() user: User) {
        const currentUser = await this.userService.getUserById(id, user);
        return this.gameService.getLastGamesByUser(currentUser);
    }
}