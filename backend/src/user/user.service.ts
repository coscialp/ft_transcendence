import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/auth/user.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
  ) {}

  private isUUID(id: string): Boolean {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
  }

  async getUser(): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    const users = await query.getMany();

    return users;
  }

  async getUserById(id: string, user: User): Promise<User> {
    const username = id;
    if (id === 'me') {
      return user;
    } else {
      let found: User = this.isUUID(id)
        ? await this.userRepository.findOne(id)
        : await this.userRepository.findOne({ username });
      if (!found) throw new NotFoundException(`User ${id} not found`);

      return found;
    }
  }

  async getUsername(id: string, user: User): Promise<{ username: string }> {
    const { username } = await this.getUserById(id, user);

    return { username };
  }

  async getEmail(id: string, user: User): Promise<{ email: string }> {
    const { email } = await this.getUserById(id, user);

    return { email };
  }

  async getName(
    id: string,
    user: User,
  ): Promise<{ firstname: string; lastname: string }> {
    const { firstName, lastName } = await this.getUserById(id, user);

    return { firstname: firstName, lastname: lastName };
  }

  async getDisplayName(
    id: string,
    user: User,
  ): Promise<{ displayname: string }> {
    const { firstName, lastName } = await this.getUserById(id, user);

    return { displayname: `${firstName} ${lastName}` };
  }

  async getNickname(id: string, user: User): Promise<{ nickname: string }> {
    const { nickName } = await this.getUserById(id, user);

    return { nickname: nickName };
  }

  async patchNickname(id: string, user: User, nickname: string): Promise<User> {
    const found = await this.getUserById(id, user);

    found.nickName = nickname;

    await this.userRepository.save(found);

    return found;
  }

  async getAvatar(id: string, user: User): Promise<{ avatar: string }> {
    const { profileImage } = await this.getUserById(id, user);

    return { avatar: profileImage };
  }
}
