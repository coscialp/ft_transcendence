import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { UsersRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";
import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";

@EntityRepository(Channel)
export class ChannelsRepository extends Repository<Channel> {
    constructor(
        @InjectRepository(UsersRepository) private readonly usersRepository: UsersRepository,
        ) {
        super();
    }

    async createChannel(user: User, name: string, password: string, userService: UserService): Promise<void> {
        const channel: Channel = this.create({
            name,
            password,
            creator: user,
            messages: [],
            admin: [],
            userConnected: [],
        })

        channel.admin.push(user);
        channel.userConnected.push(user);

        user.channels = (await userService.getChannelsCreator(user)).channels;
        user.channels.push(channel);

        user.channelsAdmin = (await userService.getChannelsAdmin(user)).channelsAdmin;
        user.channelsAdmin.push(channel);

        user.channelsConnected = (await userService.getChannelsConnected(user)).channelsConnected;
        user.channelsConnected.push(channel);

        try {
            this.save(channel)
            this.usersRepository.save(user);
        } catch (e) {
            console.log(e.code);
        }
    }
}