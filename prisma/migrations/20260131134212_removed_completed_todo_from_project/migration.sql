/*
  Warnings:

  - You are about to drop the column `projectID` on the `CompletedTodo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompletedTodo" DROP CONSTRAINT "CompletedTodo_projectID_fkey";

-- DropIndex
DROP INDEX "CompletedTodo_projectID_idx";

-- AlterTable
ALTER TABLE "CompletedTodo" DROP COLUMN "projectID",
ADD COLUMN     "projectColor" TEXT,
ADD COLUMN     "projectName" TEXT;
