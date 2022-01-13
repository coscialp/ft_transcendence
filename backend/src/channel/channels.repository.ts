import { Logger } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { UsersRepository } from "src/user/user.repository";
import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";

@EntityRepository(Channel)
export class ChannelsRepository extends Repository<Channel> {
    constructor(private readonly usersRepository: UsersRepository) {
        super();
    }

    async createChannel(user: User, name: string, password: string): Promise<void> {
        const channel: Channel = this.create({
            name,
            password,
            // creator: user,
            messages: [],
            // admin: [user],
            // userConnected: [user],
        })

        // user.channels.push(channel);
        // user.channelsAdmin.push(channel);
        // user.channelsConnected.push(channel);

        try {
            this.save(channel);
            // this.save(user);
        } catch (e) {
            console.log(e.code);
        }
    }
}