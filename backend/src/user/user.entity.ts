import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(type => User, {cascade: false})
    friends: User[];
}