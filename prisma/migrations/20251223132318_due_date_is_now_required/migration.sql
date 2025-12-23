/*
  Warnings:

  - Made the column `due` on table `todos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "todos" ALTER COLUMN "due" SET NOT NULL;
