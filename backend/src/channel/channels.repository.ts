import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserService } from "src/user/user.service";
import { EntityRepository, Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import * as bcrypt from 'bcryptjs';

@EntityRepository(Channel)
export class ChannelsRepository extends Repository<Channel> {

    async getChannel(): Promise<Channel[]> {
        const query = this.createQueryBuilder('channel')
        .leftJoinAndSelect('channel.creator', 'creator')
        .leftJoinAndSelect('channel.admin', 'admin')
        .leftJoinAndSelect('channel.userConnected', 'userConnected')
        .leftJoinAndSelect('channel.messages', 'messages')
    
        const channels = await query.getMany();
    
        return channels;
      }

    async createChannel(user: User, name: string, password: string, userService: UserService): Promise<void> {
        const currUser = await userService.getUserById(user.id);

        let hashedPassword: string = "";

        if (password !== "" ) {
            const salt: string = await bcrypt.genSalt();
            hashedPassword = await bcrypt.hash(password, salt);
        }
        
        const channel: Channel = this.create({
            name,
            password: hashedPassword,
            creator: currUser,
            messages: [],
            admin: [],
            userConnected: [],
        })

        channel.admin.push(currUser);
        channel.userConnected.push(currUser);

    
        currUser.channels = (await userService.getChannelsCreator(currUser)).channels;
        currUser.channels.push(channel);

        currUser.channelsAdmin = (await userService.getChannelsAdmin(currUser)).channelsAdmin;
        currUser.channelsAdmin.push(channel);

        currUser.channelsConnected = (await userService.getChannelsConnected(currUser)).channelsConnected;
        currUser.channelsConnected.push(channel);

        try {
            await this.save(channel);
        } catch (e) {
            console.log(e.code);
        }
    }

    async joinChannel(user: User, channel: Channel, userService: UserService) {
        channel.userConnected.push(user);

        user.channelsConnected = (await userService.getChannelsConnected(user)).channelsConnected;
        user.channelsConnected.push(channel);

        try {
            await this.save(channel)
        } catch (e) {
            console.log(e.code);
        }
    }

    async promoteToAdmin(user: User, channel: Channel) {
        channel.admin.push(user);

        try {
           await this.save(channel)
        } catch (e) {
            console.log(e.code);
        }
    }

    async demoteToPeon(user: User, channel: Channel) {
        channel.admin.splice(channel.admin.findIndex((u) => u.username === user.username), 1);

        try {
            await this.save(channel)
        } catch (e) {
            console.log(e.code);
        }
    }
}