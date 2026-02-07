/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `UserPreferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userID_key" ON "UserPreferences"("userID");
