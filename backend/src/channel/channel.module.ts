import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelGateway } from './channel.gateway';

@Module({
    imports: [AuthModule],
    providers: [ChannelGateway],
})
export class ChannelModule {}
