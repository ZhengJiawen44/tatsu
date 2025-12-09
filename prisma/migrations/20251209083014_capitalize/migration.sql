/*
  Warnings:

  - You are about to drop the `completedTodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "completedTodo" DROP CONSTRAINT "completedTodo_userID_fkey";

-- DropTable
DROP TABLE "completedTodo";

-- CreateTable
CREATE TABLE "CompletedTodo" (
    "id" TEXT NOT NULL,
    "originalTodoID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedOnTime" BOOLEAN NOT NULL,
    "daysToComplete" INTEGER NOT NULL,
    "wasRepeating" BOOLEAN NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "CompletedTodo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompletedTodo" ADD CONSTRAINT "CompletedTodo_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
