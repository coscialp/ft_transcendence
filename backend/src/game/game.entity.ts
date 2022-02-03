import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: string;

    @Column()
    ranked: string;

    @ManyToOne(type => User, user => user.games)
    player1: User;

    @ManyToOne(type => User, user => user.games)
    player2: User;

    @Column()
    score1: number;

    @Column()
    score2: number;
}