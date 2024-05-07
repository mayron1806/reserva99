export type Bucket = 'company-photo-list';
export type UploadFileProps = {
  file: Express.Multer.File;
  path: string;
  bucket: Bucket;
  contentType?: string;
};
export type DownloadFileProps = {
  path: string;
  bucket: Bucket;
};
export type DeleteFileProps = {
  path: string;
  bucket: Bucket;
}