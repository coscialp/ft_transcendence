import { User } from "src/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    content: string;

    @Column()
    date: string;

    @ManyToOne(type => User, user => user.messagesSend, {cascade: false})
    sender: User;

    @ManyToOne(type => User, user => user.messagesReceive, {nullable: true, cascade: false})
    receiver: User | null;

    @ManyToOne(type => Channel, channel => channel.messages, {nullable: true})
    channel: Channel | null;
}