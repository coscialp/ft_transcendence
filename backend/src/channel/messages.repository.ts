import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { EntityRepository, Repository } from 'typeorm';
import { ChannelsRepository } from './channels.repository';
import { MessagesDto } from './dto/messages.dto';
import { Message } from './message.entity';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(ChannelsRepository)
    private readonly channelRepository: ChannelsRepository,
  ) {
    super();
  }

  async createMessage(
    user: User,
    message: MessagesDto,
  ): Promise<void> {
    const msg: Message = this.create({
      sender: user,
      content: message.body,
      date: message.sentAt,
      receiver: message.receiver,
      channel: message.channel,
    });

    user.messagesSend.push(msg);

    if (message.receiver) {
      message.receiver.messagesReceive.push(msg);
    }

    if (message.channel) {
      message.channel.messages.push(msg);
    }

    try {
      await this.save(msg);
      await this.usersRepository.save(user);
    } catch (e) {
      console.log(e.code);
    }
  }

  async getMessages(): Promise<Message[]> {
    const query = this.createQueryBuilder('message')
    .leftJoinAndSelect('message.sender', 'sender')
    .leftJoinAndSelect('message.receiver', 'receiver')
    .leftJoinAndSelect('message.channel', 'channel')

    const messages = await query.getMany();

    return messages;
  }

}
