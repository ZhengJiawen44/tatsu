import { S3Client } from "@aws-sdk/client-s3";

const ACCESS_KEY_ID = process.env.AWS_ACCESSKEYID;
const ACCESS_KEY_SECRET = process.env.AWS_SECRETACCESSKEY;

if (!ACCESS_KEY_ID || !ACCESS_KEY_SECRET) {
  throw new Error("AWS S3 configuration has missing credentials");
}
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: "process.env.AWS_ACCESSKEYID",
    secretAccessKey: "process.env.AWS_SECRETACCESSKEY",
  },
});
