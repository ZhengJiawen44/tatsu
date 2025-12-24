/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `CompletedTodo` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `CompletedTodo` table. All the data in the column will be lost.
  - You are about to drop the column `wasRepeating` on the `CompletedTodo` table. All the data in the column will be lost.
  - Added the required column `dtstart` to the `CompletedTodo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due` to the `CompletedTodo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rrule` to the `CompletedTodo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedTodo" DROP COLUMN "expiresAt",
DROP COLUMN "startedAt",
DROP COLUMN "wasRepeating",
ADD COLUMN     "dtstart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "due" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rrule" TEXT NOT NULL;
