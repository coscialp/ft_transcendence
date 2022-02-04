import { User } from "src/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    password: string;

    @ManyToOne(type => User, user => user.channels, {nullable: true})
    creator: User | null;

    @OneToMany(type => Message, message => message.channel)
    messages: Message[];
    
    @ManyToMany(type => User, user => user.channelsAdmin)
    @JoinTable()
    admin: User[];

    @ManyToMany(type => User, user => user.channelsConnected, {cascade: false})
    @JoinTable()
    userConnected: User[];
}