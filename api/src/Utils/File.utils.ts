import { randomUUID } from "crypto";
import { Bucket } from "src/modules/storage/types";

type UploadType = 'company-photo';

export class FileUtils {
  static getBucketAndPath(uploadType: UploadType, identifier: string, fileExt: string) {
    return {
      path: `${identifier}/${randomUUID()}.${fileExt}`,
      bucket: uploadType === 'company-photo' ? 'company-photo-list' : 'company-photo-list' as Bucket,
      contentType: 'image/png'
    };
  }
}