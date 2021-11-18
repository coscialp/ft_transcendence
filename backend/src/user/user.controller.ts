import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './user.entity';
import { GetUserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getUser(@Query() filterDto: GetUserFilterDto): Promise<User[]> {
        return await this.userService.getUser(filterDto);
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

    @Get('/:id/avatar')
    async getAvatar(@Param('id') id: string, @GetUser() user: User): Promise<{ avatar: string }> {
        return await this.userService.getAvatar(id, user);
    }
}
