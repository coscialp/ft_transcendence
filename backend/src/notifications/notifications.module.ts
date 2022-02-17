import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NotificationsGateway } from './notifications.gateway'
import { NotificationsService } from './notifications.service'

@Module({
    imports: [
        AuthModule,
    ],
    providers: [NotificationsGateway, NotificationsService],
    controllers: [],
})
export class NotificationsModule {}
