import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { GameModule } from './game/game.module';
import { AppLoggerMiddleware } from './app.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, UserModule, ChannelModule, GameModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
