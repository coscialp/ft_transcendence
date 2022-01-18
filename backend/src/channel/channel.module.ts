import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChannelGateway } from './channel.gateway';
import { ChannelsRepository } from './channels.repository';
import { ChannelService } from './channel.service';
import { MessagesRepository } from './messages.repository';
import { ChannelController } from './channel.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ChannelsRepository, MessagesRepository]),
        UserModule,
    ],
    providers: [ChannelGateway, ChannelService],
    controllers: [ChannelController],
})
export class ChannelModule {}
