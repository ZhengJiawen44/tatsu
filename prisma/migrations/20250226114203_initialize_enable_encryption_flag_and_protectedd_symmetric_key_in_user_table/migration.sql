-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enableEncryption" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "protectedSymmetricKey" BYTEA;
