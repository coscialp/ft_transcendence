import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { GetUserFilterDto } from 'src/user/dto/user-filter.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUser(filterDto: GetUserFilterDto): Promise<User[]> {
    const query = this.createQueryBuilder('user');

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
    const { username, password } = authCredentialsDto;

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user: User = this.create({ username, password: hashedPassword, isLogged: false});
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
    } = authCredentialsDto;

    const user: User = this.create({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
      profileImage: profileImage,
      email: email,
      isLogged: false,
      friends: [],
    });

    try {
      await this.save(user);
    } catch (error) {
      console.log(error.code);
    }
  }
}
