import { Channel } from "src/entities/channel.entity";
import { Message } from "src/entities/message.entity";
import { Game } from "src/entities/game.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequest } from "./friend-request.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({nullable: true})
    password?: string | null;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true})
    nickName?: string | null;

    @Column({nullable: true})
    profileImage?: string | null;

    @Column()
    email: string;

    @Column({default: 'offline'})
    isLogged: string;

    @Column({default: false})
    isAdmin: boolean;

    @Column()
    GoalTaken: number;

    @Column()
    GoalSet: number;

    @Column()
    NormalGameNumber: number;

    @Column()
    RankedGameNumber: number;

    @Column()
    NormalWinNumber: number;

    @Column()
    RankedWinNumber: number;

    @Column()
    PP: number;

    @Column({default: false})
    twoFactorAuth: boolean;

    @Column({default: false})
    Security: boolean;

    @Column({default: 0})
    Friend: number;

    @Column({default: false})
    Climber: boolean;

    @Column({default: 0})
    Hater: number;

    // @Column({default: [
    //     {name: 'authentifier', lvl: 1, value: 0, max: 5, ratio: 2},
    //     {name: 'friendship', lvl: 1, value: 0, max: 1, ratio: 5},
    //     {name: 'guardian', lvl: 1, value: 0, max: 1, ratio: 2},
    //     {name: 'climber', lvl: 1, value: 0, max: 5, ratio: 2},
    //     {name: 'persevering', lvl: 1, value: 0, max: 10, ratio: 3},
    //     {name: 'hater', lvl: 1, value: 0, max: 1, ratio: 2},
    // ]
    // })
    // achievements: Achievement[]

    @OneToMany(type => Game, game => game.player1 || game.player2)
    games: Game[];

    @OneToMany(type => FriendRequest, request => request.from)
    requestFrom: FriendRequest[];

    @OneToMany(type => FriendRequest, request => request.to)
    requestTo: FriendRequest[];

    @OneToMany(type => Message, message => message.sender)
    messagesSend: Message[];

    @OneToMany(type => Message, message => message.receiver)
    messagesReceive: Message[];

    @OneToMany(type => Channel, channel => channel.creator)
    channels: Channel[];

    @ManyToMany(type => Channel, channel => channel.admin)
    channelsAdmin: Channel[];

    @ManyToMany(type => Channel, channel => channel.userConnected)
    channelsConnected: Channel[];

    @ManyToMany(type => User, user => user.friends, {cascade: false})
    @JoinTable()
    friends: User[];

    @ManyToMany(type => User, user => user.blackList, {cascade: false})
    @JoinTable()
    blackList: User[];
}