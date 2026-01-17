-- CreateTable
CREATE TABLE "CronLog" (
    "id" TEXT NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL,
    "success" BOOLEAN NOT NULL,
    "log" TEXT NOT NULL,

    CONSTRAINT "CronLog_pkey" PRIMARY KEY ("id")
);
