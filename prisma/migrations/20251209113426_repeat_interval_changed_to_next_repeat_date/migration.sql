/*
  Warnings:

  - You are about to drop the column `repeatInDays` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "repeatInDays",
ADD COLUMN     "nextRepeatDate" TIMESTAMP(3);
