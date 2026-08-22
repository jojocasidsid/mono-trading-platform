import type { TradeModel, UserModel } from '../generated/prisma/models.js';

export interface TradeWithTraderModel extends TradeModel {
  trader: UserModel;
}

export interface TradeResponse {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;

  trader_id: string;

  trader: {
    id: string;
    username: string;
    name: string;
  };

  book: string;
  counterparty: string;

  trade_timestamp: Date;
  status: string;

  created_at: Date;
  updated_at: Date;
}

export function trade_response_mapper(trade: TradeWithTraderModel): TradeResponse {
  return {
    id: trade.id,
    symbol: trade.symbol,
    side: trade.side,
    quantity: trade.quantity,
    price: Number(trade.price),

    trader_id: trade.trader_id,

    trader: {
      id: trade.trader.id,
      username: trade.trader.username,
      name: trade.trader.name,
    },

    book: trade.book,
    counterparty: trade.counterparty,

    trade_timestamp: trade.trade_timestamp,

    status: trade.status,

    created_at: trade.created_at,
    updated_at: trade.updated_at,
  };
}
