/*
  Warnings:

  - Made the column `s3Key` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "s3Key" SET NOT NULL;
