-- AlterTable
ALTER TABLE "TodoInstances" ADD COLUMN     "durationMinutes" INTEGER,
ADD CONSTRAINT "TodoInstances_pkey" PRIMARY KEY ("id");
