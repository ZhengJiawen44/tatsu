-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "expiresAt" SET DEFAULT (date_trunc('day', CURRENT_TIMESTAMP) + INTERVAL '23 hours' + INTERVAL '59 minutes');
