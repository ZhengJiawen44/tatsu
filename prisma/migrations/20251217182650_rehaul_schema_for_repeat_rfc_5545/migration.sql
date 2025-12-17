/*
  Warnings:

  - You are about to drop the column `completed` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `nextRepeatDate` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `repeatInterval` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "completed",
DROP COLUMN "expiresAt",
DROP COLUMN "nextRepeatDate",
DROP COLUMN "repeatInterval",
ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "rrule" TEXT,
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'UTC';

-- CreateTable
CREATE TABLE "TodoInstances" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "originalDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "scheduledStart" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isCancelled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "TodoInstances_todoId_originalDate_key" ON "TodoInstances"("todoId", "originalDate");

-- AddForeignKey
ALTER TABLE "TodoInstances" ADD CONSTRAINT "TodoInstances_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
