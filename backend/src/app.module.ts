import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule, ChannelModule, GameModule],
})
export class AppModule {}
