import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GameRepository]),
        AuthModule,
        UserModule
    ],
    providers: [GameGateway, GameService],
    controllers: [GameController],
})
export class GameModule {}
