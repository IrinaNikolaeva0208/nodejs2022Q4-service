import { existsSync } from 'node:fs';
import { writeFile, stat, mkdir } from 'node:fs/promises';
import { join } from 'path';

const dirPath = join('logs');
if (!existsSync(dirPath)) mkdir(dirPath);
const maxFileSize = +process.env.LOGS_MAX_FILE_SIZE;
let filePath = join(dirPath, `logs_${Date.now()}.txt`);

export async function logToFile(message: string) {
  writeFile(filePath, message, { flag: 'a' })
    .then(() => stat(filePath))
    .then((stat) => {
      if (stat.size >= maxFileSize)
        filePath = join(dirPath, `logs_${Date.now()}.txt`);
    })
    .catch((err) => console.log(err));
}
