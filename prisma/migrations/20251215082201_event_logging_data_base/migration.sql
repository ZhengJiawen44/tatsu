-- CreateTable
CREATE TABLE "eventLog" (
    "id" TEXT NOT NULL,
    "capturedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,
    "log" TEXT NOT NULL,

    CONSTRAINT "eventLog_pkey" PRIMARY KEY ("id")
);
