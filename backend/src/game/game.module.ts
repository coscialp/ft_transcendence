import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports: [AuthModule, UserModule],
    providers: [GameGateway, GameService],
    controllers: [],
})
export class GameModule {}
