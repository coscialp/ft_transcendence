import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseGuards(AuthGuard())
export class ImageController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(@UploadedFile('file') file: any) {
    
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    };
    return response;
  }
}