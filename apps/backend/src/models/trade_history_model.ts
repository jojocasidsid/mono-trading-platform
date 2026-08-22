import type { TradeHistoryAction } from '../generated/prisma/enums.js';
import prisma from '../lib/prisma.js';

export interface CreateTradeHistoryModel {
  trade_id: string;
  action: TradeHistoryAction;
}
