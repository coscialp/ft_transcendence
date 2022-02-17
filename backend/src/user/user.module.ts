import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { UserController } from './user.controller'
import { UserService } from './user.service';
import { FriendRequestRepository } from './friend-request.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([UsersRepository, FriendRequestRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${process.env.SECRET_KEY}`,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
