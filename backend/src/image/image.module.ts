import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ImageController } from './image.controller';

@Module({
  imports: [MulterModule.register({
    dest: './upload',
  }),
  PassportModule.register({ defaultStrategy: 'jwt' }),
],
  controllers: [ImageController],
})
export class ImageModule {}