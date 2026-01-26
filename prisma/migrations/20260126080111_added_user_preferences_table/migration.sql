-- CreateEnum
CREATE TYPE "SortBy" AS ENUM ('dtstart', 'due', 'duration', 'priority');

-- CreateEnum
CREATE TYPE "GroupBy" AS ENUM ('dtstart', 'due', 'duration', 'priority');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('Ascending', 'Descending');

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "sortBy" "SortBy" NOT NULL,
    "groupBy" "GroupBy" NOT NULL,
    "direction" "Direction" NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
