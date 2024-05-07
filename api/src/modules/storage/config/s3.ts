import { S3 } from 'aws-sdk';
import { env } from 'src/constants/env';
const accountid = 'bf7d1933c041b3e4a0c4e7099bf14611';
export const s3 = new S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  endpoint: `https://${accountid}.r2.cloudflarestorage.com`,
  signatureVersion: 'v4'
});
