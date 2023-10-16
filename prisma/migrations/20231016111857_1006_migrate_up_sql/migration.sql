-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "order" DROP NOT NULL,
ALTER COLUMN "isComplete" SET DEFAULT false;
