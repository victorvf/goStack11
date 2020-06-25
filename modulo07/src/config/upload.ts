import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    tmpFolder: string;
    uploadsFolder: string;
    storage: StorageEngine;
    driver: 's3' | 'disk';
    aws: {
        bucket: string;
    };
}

export default {
    tmpFolder,
    uploadsFolder: resolve(tmpFolder, 'uploads'),
    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('HEX');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
    driver: process.env.STORAGE_DRIVER,
    aws: {
        bucket: 'app-gobarber',
    },
} as IUploadConfig;
