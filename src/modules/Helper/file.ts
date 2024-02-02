
// file.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `uploads/${file.originalname}`; // Save file in the "uploads" directory with the original filename
    fs.writeFileSync(fileName, file.buffer);
    return fileName;
  }
}
