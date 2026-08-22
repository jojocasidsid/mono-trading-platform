/*
  Warnings:

  - A unique constraint covering the columns `[closing_trade_id]` on the table `trades` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "closing_trade_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "trades_closing_trade_id_key" ON "trades"("closing_trade_id");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_closing_trade_id_fkey" FOREIGN KEY ("closing_trade_id") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
