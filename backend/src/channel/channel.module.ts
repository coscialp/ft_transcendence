import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';

@Module({
    imports: [AuthModule],
    providers: [ChannelGateway, ChannelService],
})
export class ChannelModule {}
