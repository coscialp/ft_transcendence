import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { GetUserFilterDto } from 'src/user/dto/user-filter.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUser(filterDto: GetUserFilterDto): Promise<User[]> {
    const query = this.createQueryBuilder('user')
    .leftJoinAndSelect('user.friends', 'friends')
    .leftJoinAndSelect('user.blackList', 'blackList')
    .leftJoinAndSelect('user.requestFrom', 'requestFrom')
    .leftJoinAndSelect('user.requestTo', 'requestTo')
    .leftJoinAndSelect('user.messagesSend', 'messagesSend')
    .leftJoinAndSelect('user.messagesReceive', 'messagesReceive')
    .leftJoinAndSelect('user.channels', 'channels')
    .leftJoinAndSelect('user.channelsAdmin', 'channelsAdmin')
    .leftJoinAndSelect('user.channelsConnected', 'channelsConnected')

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
      isLogged: 'false',
      friends: [],
      blackList: [],
      twoFactorAuth: 0,
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
      profileImage: profileImage,
      email: email,
      isLogged: 'false',
      isAdmin: admin,
      friends: [],
      channels: [],
      channelsAdmin: [],
      channelsConnected: [],
      blackList: [],
      twoFactorAuth: 0,
    });

    try {
      await this.save(user);
    } catch (error) {
      console.log(error.code);
    }
  }
}
