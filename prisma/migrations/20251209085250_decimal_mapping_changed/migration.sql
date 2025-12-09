/*
  Warnings:

  - You are about to alter the column `daysToComplete` on the `CompletedTodo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "CompletedTodo" ALTER COLUMN "daysToComplete" SET DATA TYPE DECIMAL(10,2);
