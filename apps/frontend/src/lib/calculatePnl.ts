import type { TradeSide } from '@/types/trade';

interface CalculatePnlInput {
  side: TradeSide;
  quantity: number;
  tradePrice: number;
  marketPrice: number;
}

export function calculatePnl({
  side,
  quantity,
  tradePrice,
  marketPrice,
}: CalculatePnlInput): number {
  if (side === 'BUY') {
    return (marketPrice - tradePrice) * quantity;
  }

  return (tradePrice - marketPrice) * quantity;
}
