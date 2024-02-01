import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async readFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const buffer = Buffer.from(file.buffer);
        const base64String = buffer.toString('base64');
        resolve(base64String);
      } catch (error) {
        reject(new Error('Error reading file.'));
      }
    });
  }
}
