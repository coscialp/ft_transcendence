import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { EntityRepository, Repository } from 'typeorm';
import { ChannelService } from './channel.service';
import { ChannelsRepository } from './channels.repository';
import { MessagesDto } from './dto/messages.dto';
import { Message } from '../entities/message.entity';

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
    userService: UserService,
    channelService: ChannelService,
  ): Promise<void> {
    const msg: Message = this.create({
      sender: user,
      content: message.body,
      date: message.sentAt,
      receiver: message.receiver,
      channel: message.channel,
    });

    user.messagesSend = (await userService.getMessages(user.id, user)).messagesSend;
    user.messagesSend.push(msg);

    if (message.receiver) {
      message.receiver.messagesReceive = (await userService.getMessages(message.receiver.id, message.receiver)).messagesReceive;
      message.receiver.messagesReceive.push(msg);
    }

    if (message.channel) {
      message.channel.messages = (await channelService.getMessageByChannel(message.channel.name)).messages;
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
