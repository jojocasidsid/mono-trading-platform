import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QueryClient } from '@tanstack/react-query';

import { queryKeys } from '../lib/queryKeys';

import { handleWebSocketEvent } from '../websocket/websocketEventHandler';

import type { StockPrice } from '../types/stock';

import type { AggregatedPnl, TradeSummary } from '../types/trade';

describe('handleWebSocketEvent', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  describe('MARKET_PRICE_UPDATED', () => {
    it('updates the correct stock price', () => {
      const prices: StockPrice[] = [
        {
          symbol: 'AAPL',
          name: 'Apple',
          price: 100,
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft',
          price: 200,
        },
      ];

      queryClient.setQueryData(queryKeys.stocks.prices(), prices);

      handleWebSocketEvent(
        JSON.stringify({
          event: 'MARKET_PRICE_UPDATED',
          data: {
            symbol: 'AAPL',
            price: 110,
            previous_price: 100,
            updated_at: '2026-08-23T16:12:11.863Z',
          },
        }),
        queryClient
      );

      const result = queryClient.getQueryData<StockPrice[]>(queryKeys.stocks.prices());

      expect(result?.[0]).toMatchObject({
        symbol: 'AAPL',
        price: 110,
        previous_price: 100,
      });
    });

    it('does not modify other stocks', () => {
      const prices: StockPrice[] = [
        {
          symbol: 'AAPL',
          name: 'Apple',
          price: 100,
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft',
          price: 200,
        },
      ];

      queryClient.setQueryData(queryKeys.stocks.prices(), prices);

      handleWebSocketEvent(
        JSON.stringify({
          event: 'MARKET_PRICE_UPDATED',
          data: {
            symbol: 'AAPL',
            price: 110,
            previous_price: 100,
            updated_at: '2026-08-23T16:12:11.863Z',
          },
        }),
        queryClient
      );

      const result = queryClient.getQueryData<StockPrice[]>(queryKeys.stocks.prices());

      expect(result?.[1]).toMatchObject({
        symbol: 'MSFT',
        price: 200,
      });
    });
  });

  describe('MARKET_PRICE_SUMMARY_UPDATED', () => {
    it('updates market-dependent summary values', () => {
      const summary: TradeSummary = {
        total_unrealized_pnl: 100,
        total_market_value: 1000,
        active_trades: 3,
        cancelled_trades: 1,
        closed_trades: 2,
      };

      queryClient.setQueryData(queryKeys.trades.summary(), summary);

      handleWebSocketEvent(
        JSON.stringify({
          event: 'MARKET_PRICE_SUMMARY_UPDATED',
          data: {
            total_unrealized_pnl: 250,
            total_market_value: 1200,
            updated_at: '2026-08-23T16:12:11.863Z',
          },
        }),
        queryClient
      );

      const result = queryClient.getQueryData<TradeSummary>(queryKeys.trades.summary());

      expect(result).toEqual({
        total_unrealized_pnl: 250,
        total_market_value: 1200,

        active_trades: 3,
        cancelled_trades: 1,
        closed_trades: 2,
      });
    });
  });

  describe('AGGREGATED_PNL_UPDATED', () => {
    it('updates the aggregate P&L cache', () => {
      const aggregatedPnl: AggregatedPnl[] = [
        {
          symbol: 'AAPL',
          market_price: 110,
          net_quantity: 10,
          active_trades: 2,
          total_market_value: 1100,
          total_unrealized_pnl: 150,
        },
      ];

      handleWebSocketEvent(
        JSON.stringify({
          event: 'AGGREGATED_PNL_UPDATED',
          data: {
            data: aggregatedPnl,
            updated_at: '2026-08-23T16:12:11.863Z',
          },
        }),
        queryClient
      );

      const result = queryClient.getQueryData<AggregatedPnl[]>(queryKeys.trades.symbols());

      expect(result).toEqual(aggregatedPnl);
    });
  });

  describe('trade lifecycle events', () => {
    it.each(['TRADE_CREATED', 'TRADE_UPDATED', 'TRADE_CANCELLED', 'TRADE_CLOSED'])(
      'invalidates trade and history queries for %s',
      async event => {
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

        handleWebSocketEvent(
          JSON.stringify({
            event,
            data: {
              id: 'trade-1',
            },
          }),
          queryClient
        );

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: queryKeys.trades.all,
        });

        expect(invalidateSpy).toHaveBeenCalledWith({
          queryKey: queryKeys.tradeHistory.all,
        });
      }
    );
  });

  describe('invalid messages', () => {
    it('does not throw for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => {
        handleWebSocketEvent('not-json', queryClient);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
