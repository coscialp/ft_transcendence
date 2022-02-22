import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { GetUserFilterDto } from 'src/user/dto/user-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsRepository } from 'src/channel/channels.repository';
import { Channel } from 'src/entities/channel.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(ChannelsRepository)
    private readonly channelRepository: ChannelsRepository,
  ) {
    super();
  }

  async getUser(filterDto: GetUserFilterDto): Promise<User[]> {
    const query = this.createQueryBuilder('user')

    const { search } = filterDto;

    if (search) {
      query.andWhere(
        'LOWER(user.nickName) LIKE LOWER(:search) \
        OR LOWER(user.username) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const users = await query.getMany();

    return users;
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {
      username,
      password,
      firstName,
      lastName,
      nickName,
      profileImage,
      email,
    } = authCredentialsDto;

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user: User = this.create({
      username: username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
      profileImage: '/img/beluga.jpeg',
      email: email,
      isLogged: "offline",
      friends: [],
      channels: [],
      channelsAdmin: [],
      channelsConnected: [],
      blackList: [],
      twoFactorAuth: false,
      PP: 300,
      RankedGameNumber: 0,
      NormalGameNumber: 0,
      RankedWinNumber: 0,
      NormalWinNumber: 0,
      GoalSet: 0,
      GoalTaken: 0,
      Security: false,
      Friend: 0,
      Climber: false,
      Hater: 0,
    });

    try {
      await this.save(user);
    } catch (error) {
      console.log(error.code);
    }
  }

  async createUser42(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {
      username,
      password,
      firstName,
      lastName,
      nickName,
      profileImage,
      email,
      admin,
    } = authCredentialsDto;

    const user: User = this.create({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
      profileImage: `https://cdn.intra.42.fr/users/${username}.jpg`,
      email: email,
      isLogged: "offline",
      isAdmin: admin,
      friends: [],
      channels: [],
      channelsAdmin: [],
      channelsConnected: [],
      blackList: [],
      twoFactorAuth: false,
      PP: 300,
      RankedGameNumber: 0,
      NormalGameNumber: 0,
      RankedWinNumber: 0,
      NormalWinNumber: 0,
      GoalSet: 0,
      GoalTaken: 0,
      Security: false,
      Friend: 0,
      Climber: false,
      Hater: 0,
    });

    try {
      await this.save(user);
    } catch (error) {
      console.log(error.code);
    }
  }
}
