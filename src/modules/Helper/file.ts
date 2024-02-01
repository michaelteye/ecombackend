// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class FileService {
//   async readFileAsBase64(file: Express.Multer.File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       try {
//         const buffer = Buffer.from(file.buffer);
//         resolve(buffer.toString('base64'));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }


// file.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `uploads/${file.originalname}`; // Save file in the "uploads" directory with the original filename
    fs.writeFileSync(fileName, file.buffer);
    return fileName;
  }
}
