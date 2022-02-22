import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';
import { FriendRequest } from '../entities/friend-request.entity';
import { Channel } from 'src/entities/channel.entity';
import { Message } from 'src/entities/message.entity';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getUser(@Query() filterDto: GetUserFilterDto): Promise<User[]> {
        return await this.userService.getUser(filterDto);
    }
    
    @Get('/leaderboard/all')
    async getLeaderboard(): Promise<User[]> {
        return await this.userService.getLeaderboard();
    }
    @Get('/leaderboard/friends')
    async getLeaderboardByFriends(@GetUser() user: User): Promise<User[]> {
        return await this.userService.getLeaderboardByFriends(user);
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string, @GetUser() user: User): Promise<User> {
        return await this.userService.getUserById(id, user);
    }

    @Get('/:id/username')
    async getUserName(@Param('id') id: string, @GetUser() user: User): Promise<{ username: string }> {
        return await this.userService.getUsername(id, user);
    }

    @Get('/:id/email')
    async getEmail(@Param('id') id: string, @GetUser() user: User): Promise<{ email: string }> {
        return await this.userService.getEmail(id, user);
    }

    @Get('/:id/name')
    async getName(@Param('id') id: string, @GetUser() user: User): Promise<{ firstname: string, lastname: string }> {
        return await this.userService.getName(id, user);
    }

    @Get('/:id/displayname')
    async getDisplayName(@Param('id') id: string, @GetUser() user: User): Promise<{ displayname: string }> {
        return await this.userService.getDisplayName(id, user);
    }

    @Get('/:id/nickname')
    async getNickname(@Param('id') id: string, @GetUser() user: User): Promise<{ nickname: string }> {
        return await this.userService.getNickname(id, user);
    }

    @Patch('/:id/nickname')
    async patchNickname(@Param('id') id: string, @GetUser() user: User, @Body('nickname') nickname: string): Promise<User> {
        return await this.userService.patchNickname(id, user, nickname);
    }

    @Patch('/:id/avatar')
    async patchAvatar(@Param('id') id: string, @GetUser() user: User, @Body('avatar') avatar: string): Promise<User> {
        return await this.userService.patchAvatar(id, user, avatar);
    }

    @Get('/:id/avatar')
    async getAvatar(@Param('id') id: string, @GetUser() user: User): Promise<{ avatar: string }> {
        return await this.userService.getAvatar(id, user);
    }

    @Get('/:id/friends')
    async getFriends(@Param('id') id: string, @GetUser() user: User): Promise<{friends: User[]}> {
        return await this.userService.getFriends(id, user);
    }

    @Patch('/friends/request/accept')
    async addFriends(@GetUser() user: User, @Body('newFriendId') newFriendId: string): Promise<void> {
        return await this.userService.addFriends(user, newFriendId);
    }

    @Patch('/friends/request/decline')
    async declineRequest(@GetUser() user: User, @Body('fromId') fromId: string): Promise<void> {
        return await this.userService.declineRequest(user, fromId);
    }

    @Post('/friends/request')
    async requestFriend(@GetUser() user: User, @Body('newFriendId') newFriendId: string): Promise<void> {
        return await this.userService.createRequestFriend(user, newFriendId);
    }

    @Get('/:id/friends/request')
    async getFriendsRequest(@Param('id') id: string, @GetUser() user: User): Promise<{from: User[], to: User[]}> {
        return await this.userService.getFriendsRequest(id, user);
    }

    @Delete('/friends/remove')
    async deleteFriend(@GetUser() user: User, @Body('idToDelete') idToDelete: string): Promise<void> {
        return await this.userService.deleteFriend(user, idToDelete);
    }

    @Get('/:id/blacklist')
    async getBlackList(@Param('id') id: string, @GetUser() user: User): Promise<{blackList: User[]}> {
        return await this.userService.getBlackList(id, user);
    }

    @Patch('/blacklist/add')
    async addBlackList(@GetUser() user: User, @Body('newBlackListId') newBlackListId: string): Promise<void> {
        return await this.userService.addBlackList(user, newBlackListId);
    }

    @Delete('/blacklist/remove')
    async deleteBlackList(@GetUser() user: User, @Body('idToDelete') idToDelete: string): Promise<void> {
        return await this.userService.deleteBlackList(user, idToDelete);
    }

    @Get('2FA/active')
    async get2FA(@GetUser() user: User): Promise<{twoFactorAuth: boolean}> {
        return await this.userService.get2FA(user);
    }

    @Patch('2FA/activate')
    async activate2FA(@GetUser() user: User): Promise<void> {
        return await this.userService.activate2FA(user);
    }

    @Patch('2FA/deactivate')
    async deactivate2FA(@GetUser() user: User): Promise<void> {
        return await this.userService.deactivate2FA(user);
    }

    @Get('channels/creator')
    async getChannelsCreator(@GetUser() user: User): Promise<{channels: Channel[]}> {
        return await this.userService.getChannelsCreator(user);
    }

    @Get('channels/admin')
    async getChannelsAdmin(@GetUser() user: User): Promise<{channelsAdmin: Channel[]}> {
        return await this.userService.getChannelsAdmin(user);
    }

    @Get('channels/connected')
    async getChannelsConnected(@GetUser() user: User): Promise<{channelsConnected: Channel[]}> {
        return await this.userService.getChannelsConnected(user);
    }

    @Get('messages/:id')
    async getMessages(@Param('id') id: string, @GetUser() user: User): Promise<{messagesSend: Message[], messagesReceive: Message[]}> {
        return this.userService.getMessages(id, user);
    }

    @Patch('/admin/promote/:id')
    async promoteAdmin(@Param('id') id: string, @GetUser() user: User) {
        return await this.userService.promoteAdmin(id, user);
    }

    @Patch('/admin/demote')
    async demoteAdmin(@GetUser() user: User) {
        return await this.userService.demoteAdmin(user);
    }

    @Get(':id/statistics')
    async getStat(@Param('id') id: string, @GetUser() user: User) {
        return await this.userService.getStat(id, user);
    }

    @Get(':id/achievements')
    async getAchievements(@Param('id') id: string, @GetUser() user: User) {
        return await this.userService.getAchievements(id, user);
    }
} 
