import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.requestFrom)
    from: User;

    @ManyToOne(() => User, user => user.requestTo)
    to: User;
}