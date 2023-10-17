/*
  Warnings:

  - A unique constraint covering the columns `[rankString]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Todo_rankString_key" ON "Todo"("rankString");
