import type { QueryClient } from '@tanstack/react-query';

import type { StockPrice } from '@/types/stock';

export type WebSocketEventType =
  | 'TRADE_CREATED'
  | 'TRADE_UPDATED'
  | 'TRADE_CANCELLED'
  | 'TRADE_CLOSED'
  | 'MARKET_PRICE_UPDATED';

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
        queryKey: ['trades'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['trade-summary'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['trade-history'],
      });

      break;

    case 'MARKET_PRICE_UPDATED': {
      const data = payload.data as MarketPriceUpdatedData;

      queryClient.setQueryData<StockPrice[]>(['stock-prices'], currentPrices => {
        if (!currentPrices) {
          return currentPrices;
        }

        return currentPrices.map(stock =>
          stock.symbol === data.symbol
            ? {
                ...stock,
                price: data.price,
              }
            : stock
        );
      });

      break;
    }

    default:
      break;
  }
}
