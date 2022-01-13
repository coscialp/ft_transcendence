import { EntityRepository, Repository } from "typeorm";
import { Message } from "./message.entity";

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
}