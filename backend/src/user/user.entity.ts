import { Channel } from "src/channel/channel.entity";
import { Message } from "src/channel/message.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FriendRequest } from "./friend-request.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({nullable: true})
    password?: string | null;

    @Column({nullable: true})
    firstName?: string | null;

    @Column({nullable: true})
    lastName?: string | null;

    @Column({nullable: true})
    nickName?: string | null;

    @Column({nullable: true})
    profileImage?: string | null;

    @Column({nullable: true})
    email?: string | null;

    @Column()
    isLogged: string;

    @Column({nullable: false, default: false})
    isAdmin: boolean;

    @Column({nullable: false, default: 0})
    twoFactorAuth: number;

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