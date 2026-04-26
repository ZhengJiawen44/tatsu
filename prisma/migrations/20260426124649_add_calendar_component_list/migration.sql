-- CreateEnum
CREATE TYPE "CalendarComponent" AS ENUM ('VEVENT', 'VTODO', 'VJOURNAL');

-- AlterTable
ALTER TABLE "CaldavCalendar" ADD COLUMN     "components" "CalendarComponent"[];
