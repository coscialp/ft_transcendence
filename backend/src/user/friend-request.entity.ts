import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.requestFrom, {cascade: true})
    from: User;

    @ManyToOne(() => User, user => user.requestTo, {cascade: true})
    to: User;
}