import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { User } from './user.entity';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { FriendRequestRepository } from './friend-request.repository';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequest } from './friend-request.entity';
import { request, response } from 'express';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
    @InjectRepository(FriendRequestRepository)
    private friendRequestRepository: FriendRequestRepository,
  ) {}

  private isUUID(id: string): Boolean {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
  }

  async getUser(filterDto: GetUserFilterDto): Promise<User[]> {
    return this.userRepository.getUser(filterDto);
  }

  async getUserById(id: string, user?: User): Promise<User> {
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

  async addFriends(user: User, newFriendId: string): Promise<void> {
    const newFriend = await this.getUserById(newFriendId);

    user.friends = (await this.getFriends(user.id, user)).friends;
    user.friends.push(newFriend);

    newFriend.friends = (await this.getFriends(newFriendId, user)).friends;
    newFriend.friends.push(user);

    this.userRepository.save(user);
    this.userRepository.save(newFriend);
  }

  async createRequestFriend(user: User, newFriendId: string): Promise<void> {
    const newFriend = await this.getUserById(newFriendId);

    const friendRequestDto: FriendRequestDto = { from: user, to: newFriend };

    return await this.friendRequestRepository.createFriendRequest(
      friendRequestDto,
      this.userRepository,
    );
  }

  async getFriendsRequest(
    id: string,
    user: User,
  ): Promise<{ from: User[]; to: User[] }> {
    const currentUser = await this.getUserById(id, user);

    const allRequest = await this.friendRequestRepository.find({
      relations: ['from', 'to'],
    });

    const from: User[] = [],
      to: User[] = [];

    for (let request of allRequest) {
      if (request.from.id === currentUser.id) {
        to.push(request.to);
      } else if (request.to.id === currentUser.id) {
        from.push(request.from);
      }
    }

    return { from: from, to: to };
  }

  async declineRequest(user: User, fromId: string): Promise<void> {
    const fromUser = await this.getUserById(fromId);

    const allRequest = await this.friendRequestRepository.find({
      relations: ['from', 'to'],
    });

    const { from } = await this.getFriendsRequest(user.id, user);

    console.log(from);

    if (from.find((u) => { return u.id === fromId })) {
      throw new NotFoundException(`Friend's request from ${fromUser.username} not found!`)
    }
    
    for (let request of allRequest) {
      if (request.from.id === fromUser.id && request.to.id === user.id) {
        await this.friendRequestRepository.delete(request.id);
      }
    }
  }
}
