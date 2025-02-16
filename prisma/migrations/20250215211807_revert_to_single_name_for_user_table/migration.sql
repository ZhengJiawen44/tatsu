/*
  Warnings:

  - You are about to drop the column `fname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "fname",
DROP COLUMN "lname",
ADD COLUMN     "name" TEXT;
