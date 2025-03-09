/*
  Warnings:

  - You are about to drop the column `Priority` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "Priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'Low';
