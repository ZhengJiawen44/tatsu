/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoInstances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userID_fkey";

-- DropForeignKey
ALTER TABLE "TodoInstances" DROP CONSTRAINT "TodoInstances_todoId_fkey";

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "TodoInstances";

-- CreateTable
CREATE TABLE "todos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "order" SERIAL NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'Low',
    "dtstart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "rrule" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todo_instances" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "recurId" TEXT NOT NULL,
    "instanceDate" TIMESTAMP(3) NOT NULL,
    "overriddenTitle" TEXT,
    "overriddenDescription" TEXT,
    "overriddenDtstart" TIMESTAMP(3),
    "overriddenDurationMinutes" INTEGER,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "todo_instances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "todo_instances_todoId_instanceDate_key" ON "todo_instances"("todoId", "instanceDate");

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo_instances" ADD CONSTRAINT "todo_instances_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
