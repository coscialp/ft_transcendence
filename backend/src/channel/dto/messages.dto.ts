import { User } from "src/entities/user.entity";
import { Channel } from "../../entities/channel.entity";

export class MessagesDto {
    sentAt: string;
    sender: User;
    receiver: User | null;
    body: string;
    channel: Channel | null;
}