import { S3Client } from "@aws-sdk/client-s3";

const ACCESS_KEY_ID = process.env.AWS_ACCESSKEYID;
const ACCESS_KEY_SECRET = process.env.AWS_SECRETACCESSKEY;

if (!ACCESS_KEY_ID || !ACCESS_KEY_SECRET) {
  throw new Error("AWS S3 configuration has missing credentials");
}
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: ACCESS_KEY_SECRET,
  },
});
