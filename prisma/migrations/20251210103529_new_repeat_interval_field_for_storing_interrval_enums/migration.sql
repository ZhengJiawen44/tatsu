-- CreateEnum
CREATE TYPE "RepeatInterval" AS ENUM ('daily', 'weekly', 'monthly', 'weekdays');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "repeatInterval" "RepeatInterval";
