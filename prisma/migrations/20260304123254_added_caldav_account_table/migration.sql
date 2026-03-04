-- CreateTable
CREATE TABLE "CalDavAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "serverUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalDavAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalDavAccount_userId_key" ON "CalDavAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CalDavAccount_userId_service_key" ON "CalDavAccount"("userId", "service");

-- AddForeignKey
ALTER TABLE "CalDavAccount" ADD CONSTRAINT "CalDavAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
