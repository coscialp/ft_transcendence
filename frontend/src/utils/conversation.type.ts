import { User } from "./user.type";
import { MessageType, PrivateMessageType } from "./message.type";

export type Conversation = {
    property: User;
    sender: PrivateMessageType[];
    reciver: PrivateMessageType[];
}