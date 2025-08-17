// lib/s3.ts
import { S3Client } from "@aws-sdk/client-s3";

let s3: S3Client | null = null;

export function getS3Client() {
  if (!s3) {
    const accessKeyId = process.env.AWS_ACCESSKEYID;
    const secretAccessKey = process.env.AWS_SECRETACCESSKEY;
    const region = process.env.AWS_REGION;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error("AWS S3 configuration has missing credentials");
    }

    s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3;
}
