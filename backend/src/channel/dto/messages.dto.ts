import { User } from "src/user/user.entity";
import { Channel } from "../channel.entity";

export class MessagesDto {
    sentAt: string;
    sender: User;
    receiver: User | null;
    body: string;
    channel: Channel | null;
}