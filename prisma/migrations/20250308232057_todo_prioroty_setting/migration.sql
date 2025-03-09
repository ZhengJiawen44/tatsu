-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "Priority" "Priority" NOT NULL DEFAULT 'Low';
