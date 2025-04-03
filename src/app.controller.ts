/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { AppService } from './app.service';
import { multerConfig, multerOptions } from './utils';
import { LoggingInterceptor } from './logging.interceptor';
import * as path from 'path';
import { Jimp } from 'jimp';
import * as QrCode from 'qrcode-reader';

// @UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('upload/:filename')
  seeUploadedFile(@Param('filename') image, @Res() res) {
    try {
      return res.sendFile(image, { root: multerConfig.dest });
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
  @Delete('upload/:filename')
  DeleteUploadedFile(@Param('filename') filename) {
    try {
      const filePath = multerConfig.dest + '/' + filename;
      fs.unlinkSync(filePath);

      return 'file deleted';
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const fs = require('fs').promises;
    const buff = Buffer.alloc(100);
    const header = Buffer.from('mvhd');

    const fileToRead = await fs.open(file.path, 'r');
    const { buffer } = await fileToRead.read(buff, 0, 100, 0);

    await fileToRead.close();

    const start = buffer.indexOf(header) + 17;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);

    const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;

    const response = {
      originalname: file?.originalname,
      filename: file?.filename,
      fileDuration: audioLength.toFixed(0),
    };
    return response;
  }

  @Post('single/qrdecode')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'No file uploaded' };
    }

    try {
      const fileBuffer = fs.readFileSync(file.path);
      const image = await Jimp.read(fileBuffer);

      const qr = new QrCode();
      return new Promise((resolve, reject) => {
        qr.callback = (err, value) => {
          if (err) {
            reject({ error: 'Could not read QR code' });
          } else {
            resolve({ url: value.result });
          }
        };
        qr.decode(image.bitmap);
      });
    } catch (error) {
      return { error: 'Failed to process image' };
    }
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];

    files.forEach((file) => {
      const fileReponse = {
        originalname: file?.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }
}
