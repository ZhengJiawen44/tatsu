-- AlterTable
ALTER TABLE "CalDavAccount" ADD COLUMN     "refresh_token" TEXT,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
