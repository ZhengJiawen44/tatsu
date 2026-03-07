/*
  Warnings:

  - Added the required column `uid` to the `SyncMetaData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SyncMetaData" ADD COLUMN     "uid" TEXT NOT NULL;
