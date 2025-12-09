-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "expiresAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "completedTodo" (
    "id" TEXT NOT NULL,
    "originalTodoID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedOnTime" BOOLEAN NOT NULL,
    "daysToComplete" INTEGER NOT NULL,
    "wasRepeating" BOOLEAN NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "completedTodo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "completedTodo" ADD CONSTRAINT "completedTodo_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
