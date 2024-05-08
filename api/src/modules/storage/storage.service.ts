import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteFileProps, DownloadFileProps, UploadFileProps } from './types';
import { s3Client } from './config/s3Client';
import { GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  async getDowloadUrl({ bucket, path }: DownloadFileProps) {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: path,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
    return url;
  }
  async getUploadUrl({ bucket, path, contentType }: Omit<UploadFileProps, 'file'>) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
    return url;
  }
  async downloadFile({ bucket, path }: DownloadFileProps) {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      }),
    );
    const stream = response.Body as Readable;
    return new Promise<Buffer>((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', reject);
    });
  }
  async deleteFile({ bucket, path }: DeleteFileProps) {
    const response = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: path
      }),
    );
    return !!response.RequestCharged;
  }
}
