import { Injectable, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname, join } from 'path';
import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { rm } from 'fs/promises';

@Injectable()
export class TrackFilesService {
  static async deleteTrackFile(filename: string) {
    try {
      await rm(join('track_files', filename));
    } catch (err) {
      console.log(err);
    }
  }

  static getFileInterceptor() {
    return FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './track_files',
        filename(req, file, callback) {
          const uniqueFilename = `track_${Date.now()}${extname(
            file.originalname,
          )}`;
          callback(null, uniqueFilename);
        },
      }),
    });
  }

  static getFilePipe() {
    return new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'audio/mpeg',
      })
      .addMaxSizeValidator({
        maxSize: 10e9,
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
  }
}
