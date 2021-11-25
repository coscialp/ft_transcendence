import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';
import { GetUserFilterDto } from './dto/user-filter.dto';

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

  async getUser(filterDto: GetUserFilterDto): Promise<User[]> {
    return this.userRepository.getUser(filterDto);
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

  async getFriends(id: string, user: User): Promise<{ friends: User[] }> {
    const currentUser = await this.getUserById(id, user);

    const allUser = await this.userRepository.find({ relations: ['friends'] });
    const friends = allUser.find((user) => {
      return user.username === currentUser.username;
    }).friends;

    return { friends: friends };
  }

  async addFriends(id: string, user: User, newFriendId: string): Promise<void> {
    const newFriend = await this.getUserById(newFriendId, user);
    const currentUser = await this.getUserById(id, user);

    currentUser.friends = (await this.getFriends(id, user)).friends;
    currentUser.friends.push(newFriend);

    newFriend.friends = (await this.getFriends(newFriendId, user)).friends;
    newFriend.friends.push(currentUser);

    this.userRepository.save(currentUser);
    this.userRepository.save(newFriend);
  }
}
