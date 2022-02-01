import { User } from "./user.type";
import { MessageType } from "./message.type";

export type Conversation = {
    property: User;
    conversations: MessageType[];
}