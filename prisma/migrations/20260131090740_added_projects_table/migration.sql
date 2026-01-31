-- AlterTable
ALTER TABLE "CompletedTodo" ADD COLUMN     "projectID" TEXT;

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "projectID" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_userID_idx" ON "Project"("userID");

-- CreateIndex
CREATE INDEX "CompletedTodo_userID_idx" ON "CompletedTodo"("userID");

-- CreateIndex
CREATE INDEX "CompletedTodo_projectID_idx" ON "CompletedTodo"("projectID");

-- CreateIndex
CREATE INDEX "todos_userID_idx" ON "todos"("userID");

-- CreateIndex
CREATE INDEX "todos_projectID_idx" ON "todos"("projectID");

-- CreateIndex
CREATE INDEX "todos_userID_projectID_idx" ON "todos"("userID", "projectID");

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedTodo" ADD CONSTRAINT "CompletedTodo_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
