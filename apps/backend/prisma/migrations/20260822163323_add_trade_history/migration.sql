/*
  Warnings:

  - You are about to drop the column `closing_trade_id` on the `trades` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TradeHistoryAction" AS ENUM ('CREATED', 'UPDATED', 'CANCELLED', 'CLOSED');

-- AlterEnum
ALTER TYPE "TradeStatus" ADD VALUE 'CLOSED';

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_closing_trade_id_fkey";

-- DropIndex
DROP INDEX "trades_closing_trade_id_key";

-- AlterTable
ALTER TABLE "trades" DROP COLUMN "closing_trade_id";

-- CreateTable
CREATE TABLE "trade_histories" (
    "id" TEXT NOT NULL,
    "trade_id" TEXT NOT NULL,
    "action" "TradeHistoryAction" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trade_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trade_histories_trade_id_idx" ON "trade_histories"("trade_id");

-- CreateIndex
CREATE INDEX "trade_histories_action_idx" ON "trade_histories"("action");

-- CreateIndex
CREATE INDEX "trade_histories_created_at_idx" ON "trade_histories"("created_at");

-- AddForeignKey
ALTER TABLE "trade_histories" ADD CONSTRAINT "trade_histories_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
