-- AlterTable
ALTER TABLE "CaldavCalendar" ADD COLUMN     "currentUserPrivilegeSet" TEXT[] DEFAULT ARRAY[]::TEXT[];
