import { S3Client } from '@aws-sdk/client-s3';
import { env } from 'src/constants/env';

const accountid = 'bf7d1933c041b3e4a0c4e7099bf14611';
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountid}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }
});
