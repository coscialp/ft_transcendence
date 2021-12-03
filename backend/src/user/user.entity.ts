import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({nullable: true})
    isLogged: boolean | null;

    @OneToMany(type => FriendRequest, request => request.from)
    requestFrom: FriendRequest[];

    @OneToMany(type => FriendRequest, request => request.to)
    requestTo: FriendRequest[];

    @ManyToMany(type => User, user => user.friends, {cascade: false})
    @JoinTable()
    friends: User[];

}