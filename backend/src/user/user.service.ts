import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { FriendRequestRepository } from './friend-request.repository';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequest } from '../entities/friend-request.entity';
import { Channel } from '../entities/channel.entity';
import { Message } from '../entities/message.entity';
import { Game } from '../entities/game.entity';
import { StatDto } from './dto/stat.dto';
import { AchievementsDto } from './dto/achievements.dto';
import { GameService } from 'src/game/game.service';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');

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

  async getLeaderboard(): Promise<User[]> {
    return (await this.getUser({search: undefined})).sort((a: User, b: User) => b.PP - a.PP);
  }

  async getLeaderboardByFriends(user: User): Promise<User[]> {
    const leaderboard: User[] = [user];

    user.friends = (await this.getFriends(user.id, user)).friends;

    for (let friend of user.friends) {
      leaderboard.push(friend);
    }

    return leaderboard.sort((a: User, b: User) => b.PP - a.PP);
  }

  async getUserById(id: string, user?: User): Promise<User> {
    if (id === 'me') {
      id = user.id;
    }
    let found: User = this.isUUID(id)
      ? (await this.getUser({ search: undefined })).find(
          (user) => user.id === id,
        )
      : (await this.getUser({ search: undefined })).find(
          (user) => user.username === id,
        );
    if (!found) throw new NotFoundException(`User ${id} not found`);

    return found;
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

  async patchAvatar(id: string, user: User, avatar: string): Promise<User> {
    const found = await this.getUserById(id, user);

    found.profileImage = avatar;

    await this.userRepository.save(found);

    return found;
  }

  async getAvatar(id: string, user: User): Promise<{ avatar: string }> {
    const { profileImage } = await this.getUserById(id, user);

    return { avatar: profileImage };
  }

  async getFriends(id: string, user: User): Promise<{ friends: User[] }> {
    const currentUser: User = await this.getUserById(id, user);

    const allUser: User[] = await this.userRepository.find({
      relations: ['friends'],
    });

    const friends: User[] = allUser.find((user) => {
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

    this.declineRequest(user, newFriendId);
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
    try {
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
    } catch (error) {
      this.logger.error(error);
    }
  }

  async declineRequest(user: User, fromId: string): Promise<void> {
    const fromUser: User = await this.getUserById(fromId);

    const allRequest: FriendRequest[] = await this.friendRequestRepository.find(
      {
        relations: ['from', 'to'],
      },
    );

    const { from } = await this.getFriendsRequest(user.id, user);

    if (
      from.find((u) => {
        return u.id === fromId;
      })
    ) {
      throw new NotFoundException(
        `Friend's request from ${fromUser.username} not found!`,
      );
    }

    for (let request of allRequest) {
      if (request.from.id === fromUser.id && request.to.id === user.id) {
        await this.friendRequestRepository.delete(request.id);
      }
    }
  }

  async deleteFriend(user: User, idToDelete: string): Promise<void> {
    const userToDelete: User = await this.getUserById(idToDelete);

    const myFriends = (await this.getFriends(user.id, user)).friends;

    const hisFriends = (await this.getFriends(idToDelete, userToDelete)).friends;

    user.friends = [];
    userToDelete.friends = [];

    for (let friend of myFriends) {
      if (friend.id !== userToDelete.id) {
        user.friends.push(friend);
      }
    }

    for (let friend of hisFriends) {
      if (friend.id !== user.id) {
        userToDelete.friends.push(friend);
      }
    }
    this.userRepository.save(user);
    this.userRepository.save(userToDelete);
  }

  async getBlackList(id: string, user: User): Promise<{ blackList: User[] }> {
    const currentUser = await this.getUserById(id, user);

    const allUser = await this.userRepository.find({
      relations: ['blackList'],
    });
    const blackList = allUser.find((user) => {
      return user.username === currentUser.username;
    }).blackList;

    return { blackList: blackList };
  }

  async addBlackList(user: User, newBlackListId: string): Promise<void> {
    const newBlackList = await this.getUserById(newBlackListId);

    user.blackList = (await this.getBlackList(user.id, user)).blackList;
    user.blackList.push(newBlackList);

    this.userRepository.save(user);
  }
 
  async deleteBlackList(user: User, idToDelete: string): Promise<void> {
    const userToDelete: User = await this.getUserById(idToDelete);

    const blackList = (await this.getBlackList(user.id, user)).blackList;

    user.blackList = [];

    for (let u of blackList) {
      if (u.id !== userToDelete.id) {
        user.blackList.push(u);
      }
    }

    this.userRepository.save(user);
  }

  async activate2FA(user: User): Promise<void> {
    user.twoFactorAuth = true;
    user.Security = true;
    this.userRepository.save(user);
  }

  async deactivate2FA(user: User): Promise<void> {
    user.twoFactorAuth = false;
    this.userRepository.save(user);
  }

  async get2FA(user: User): Promise<{ twoFactorAuth: boolean }> {
    return { twoFactorAuth: user.twoFactorAuth };
  }

  async getChannelsCreator(user: User): Promise<{ channels: Channel[] }> {
    const allCreator = await this.userRepository.find({
      relations: ['channels'],
    });

    const channels = allCreator.find(
      (u) => u.username === user.username,
    ).channels;

    return { channels };
  }

  async getChannelsAdmin(user: User): Promise<{ channelsAdmin: Channel[] }> {
    const allCreator = await this.userRepository.find({
      relations: ['channelsAdmin'],
    });

    const channelsAdmin = allCreator.find(
      (u) => u.username === user.username,
    ).channelsAdmin;

    return { channelsAdmin };
  }

  async getChannelsConnected(
    user: User,
  ): Promise<{ channelsConnected: Channel[] }> {
    const allCreator = await this.userRepository.find({
      relations: ['channelsConnected'],
    });

    const channelsConnected = allCreator.find(
      (u) => u.username === user.username,
    ).channelsConnected;

    return { channelsConnected };
  }

  async getMessages(
    id: string,
    user: User,
  ): Promise<{ messagesSend: Message[]; messagesReceive: Message[] }> {
    const currentUser = await this.getUserById(id, user);

    const allMessages = await this.userRepository.find({
      relations: ['messagesSend', 'messagesReceive'],
    });

    const messagesSend = allMessages.find((user) => {
      return user.username === currentUser.username;
    }).messagesSend;

    const messagesReceive = allMessages.find((user) => {
      return user.username === currentUser.username;
    }).messagesReceive;

    return { messagesSend, messagesReceive };
  }

  async promoteAdmin(id: string, user: User) {
    if (user.isAdmin) {
      const newAdmin = await this.getUserById(id);

      newAdmin.isAdmin = true;

      try {
        this.userRepository.save(newAdmin);
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new UnauthorizedException('You are not admin');
    }
  }

  async demoteAdmin(user: User) {
    if (user.isAdmin) {
        user.isAdmin = false;
      try {
        this.userRepository.save(user);
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new UnauthorizedException('You are not admin');
    }
  }

  async getGames(user: User): Promise<{ games: Game[] }> {
    const allCreator = await this.userRepository.find({
      relations: ['games'],
    });

    const games = allCreator.find(
      (u) => u.username === user.username,
    ).games;

    return { games };
  }

  async getStat(id: string, user: User): Promise<{ranked: StatDto, normal: StatDto, GA: number}> {
    const currentUser = await this.getUserById(id, user);

    const ranked: StatDto = {
      winrate: (currentUser.RankedWinNumber / currentUser.RankedGameNumber * 100).toFixed(1) + '%',
      played: currentUser.RankedGameNumber,
    }

    const normal: StatDto = {
      winrate: (currentUser.NormalWinNumber / currentUser.NormalGameNumber * 100).toFixed(1) + '%',
      played: currentUser.NormalGameNumber,
    }

    return { ranked, normal, GA: Number(Math.fround(currentUser.GoalSet / currentUser.GoalTaken).toFixed(2))};
  }

  async getAchievements(id: string, user: User): Promise<{Security: boolean, Friend: number, Climber:  number, Persevering: number, Hater: number}> {
    const currentUser = await this.getUserById(id, user);

    const allUser: User[] = await this.userRepository.find({
      relations: ['friends'],
    });

    const friends: User[] = allUser.find((user) => {
      return user.username === currentUser.username;
    }).friends;

    const allUserB = await this.userRepository.find({
      relations: ['blackList'],
    });
    const blackList = allUserB.find((user) => {
      return user.username === currentUser.username;
    }).blackList;
    const achievements = {
      Security: currentUser.Security,
      Friend: friends.length / 5 * 100,
      Climber:  currentUser.PP >= 300 ? (currentUser.PP - 300) / 50 * 100 : 0, 
      Persevering: (currentUser.NormalGameNumber + currentUser.RankedGameNumber) / 5 * 100, 
      Hater: blackList.length / 5 * 100,
    }
    
    return achievements;
  }
}
