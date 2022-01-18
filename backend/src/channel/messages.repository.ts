import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { EntityRepository, Repository } from 'typeorm';
import { MessagesDto } from './dto/messages.dto';
import { Message } from './message.entity';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {
    super();
  }

  async createMessage(
    user: User,
    message: MessagesDto,
    userService: UserService,
  ): Promise<void> {
    const msg: Message = this.create({
      sender: user,
      content: message.body,
      date: message.sentAt,
      receiver: message.receiver,
      channel: message.channel,
    });

    user.messagesSend = (
      await userService.getMessages(user.id, user)
    ).messagesSend;
    user.messagesSend.push(msg);

    if (message.receiver) {
    message.receiver.messagesReceive = (
      await userService.getMessages(message.receiver.id, message.receiver)
    ).messagesReceive;
    message.receiver.messagesReceive.push(msg);
    }

    try {
      this.save(msg);
      this.usersRepository.save(user);
      if (message.receiver) {
        this.usersRepository.save(message.receiver);
      }
    } catch (e) {
      console.log(e.code);
    }
  }
}
