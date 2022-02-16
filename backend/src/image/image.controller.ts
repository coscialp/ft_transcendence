import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');


const app = express ();

@Controller('upload')
@UseGuards(AuthGuard())
export class ImageController {
  constructor() {}


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null , file.originalname );
    }
});

const upload = multer({ storage: this.storage })

// Serve Static Files

app.use(express.static('uploads'));
}
