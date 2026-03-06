-- CreateTable
CREATE TABLE "CaldavCalendar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timezone" TEXT,
    "name" TEXT,
    "source" TEXT NOT NULL,
    "ctag" TEXT NOT NULL,
    "syncToken" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaldavCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncMetaData" (
    "id" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,
    "caldavCalendarId" TEXT NOT NULL,
    "remoteUrl" TEXT NOT NULL,
    "etag" TEXT NOT NULL,
    "icsData" TEXT,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaldavCalendar_url_key" ON "CaldavCalendar"("url");

-- CreateIndex
CREATE INDEX "CaldavCalendar_userId_idx" ON "CaldavCalendar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CaldavCalendar_userId_url_key" ON "CaldavCalendar"("userId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "SyncMetaData_todoId_key" ON "SyncMetaData"("todoId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncMetaData_remoteUrl_key" ON "SyncMetaData"("remoteUrl");

-- CreateIndex
CREATE INDEX "SyncMetaData_caldavCalendarId_idx" ON "SyncMetaData"("caldavCalendarId");

-- AddForeignKey
ALTER TABLE "CaldavCalendar" ADD CONSTRAINT "CaldavCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaldavCalendar" ADD CONSTRAINT "CaldavCalendar_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "CalDavAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncMetaData" ADD CONSTRAINT "SyncMetaData_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncMetaData" ADD CONSTRAINT "SyncMetaData_caldavCalendarId_fkey" FOREIGN KEY ("caldavCalendarId") REFERENCES "CaldavCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
