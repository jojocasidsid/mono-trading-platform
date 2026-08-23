import type { QueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';

import type { StockPrice } from '@/types/stock';
import type { AggregatedPnl, TradeSummary } from '@/types/trade';

export type WebSocketEventType =
  | 'TRADE_CREATED'
  | 'TRADE_UPDATED'
  | 'TRADE_CANCELLED'
  | 'TRADE_CLOSED'
  | 'MARKET_PRICE_UPDATED'
  | 'MARKET_PRICE_SUMMARY_UPDATED'
  | 'AGGREGATED_PNL_UPDATED';

interface WebSocketEvent<T = unknown> {
  event: WebSocketEventType;
  data: T;
}

interface MarketPriceUpdatedData {
  symbol: string;
  price: number;
  previous_price: number;
  updated_at: string;
}

interface MarketPriceSummaryUpdatedData {
  total_unrealized_pnl: number;
  total_market_value: number;
  updated_at: string;
}

interface AggregatedPnlUpdatedData {
  data: AggregatedPnl[];
}

export function handleWebSocketEvent(message: string, queryClient: QueryClient): void {
  let payload: WebSocketEvent;

  try {
    payload = JSON.parse(message) as WebSocketEvent;
  } catch {
    console.error('Invalid WebSocket message:', message);

    return;
  }

  switch (payload.event) {
    case 'TRADE_CREATED':
    case 'TRADE_UPDATED':
    case 'TRADE_CANCELLED':
    case 'TRADE_CLOSED':
      void queryClient.invalidateQueries({
        queryKey: queryKeys.trades.all,
      });

      void queryClient.invalidateQueries({
        queryKey: queryKeys.tradeHistory.all,
      });

      break;

    case 'MARKET_PRICE_UPDATED': {
      const data = payload.data as MarketPriceUpdatedData;

      queryClient.setQueryData<StockPrice[]>(queryKeys.stocks.prices(), currentPrices => {
        if (!currentPrices) {
          return currentPrices;
        }

        return currentPrices.map(stock =>
          stock.symbol === data.symbol
            ? {
                ...stock,
                previous_price: data.previous_price,
                price: data.price,
              }
            : stock
        );
      });

      break;
    }

    case 'MARKET_PRICE_SUMMARY_UPDATED': {
      const data = payload.data as MarketPriceSummaryUpdatedData;

      queryClient.setQueryData<TradeSummary>(queryKeys.trades.summary(), currentSummary => {
        if (!currentSummary) {
          return currentSummary;
        }

        return {
          ...currentSummary,

          total_unrealized_pnl: data.total_unrealized_pnl,

          total_market_value: data.total_market_value,
        };
      });

      break;
    }

    case 'AGGREGATED_PNL_UPDATED': {
      const data = payload.data as AggregatedPnlUpdatedData;

      queryClient.setQueryData<AggregatedPnl[]>(queryKeys.trades.symbols(), data.data);

      break;
    }

    default:
      break;
  }
}
