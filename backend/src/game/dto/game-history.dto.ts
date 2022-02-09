import { User } from "src/entities/user.entity";

export class GameHistoryDto {
    player1: User;

    player2: User;

    score1: number;

    score2: number;

    date: string;

    ranked: boolean;
}