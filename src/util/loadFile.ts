import { readFile, exists } from 'fs';
import { join } from 'path';

export const loadFile = (...path: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fullPath = join(...path);
    exists(fullPath, doesExist => {
      if (!doesExist) {
        reject('file does not exist');
      } else {
        readFile(fullPath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString('utf8'));
          }
        });
      }
    });
  });
};
