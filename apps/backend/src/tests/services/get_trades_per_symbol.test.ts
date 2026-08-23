import { beforeEach, describe, expect, it, vi } from 'vitest';

import type TradeRepository from '../../repositories/trade_repository.js';

const { get_market_price_mock } = vi.hoisted(() => ({
  get_market_price_mock: vi.fn(),
}));

vi.mock('../../providers/market_price_provider.js', () => ({
  get_market_price: get_market_price_mock,
}));

import ListTradesPerSymbol from '../../services/trade_services/list_trades_per_symbol.js';

describe('GetAggregatedPnlService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const create_repository = (trades: unknown[] = []) => {
    return {
      list_all_by_status: vi.fn().mockResolvedValue(trades),
    };
  };

  it('groups multiple trades by symbol', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 5,
        price: 105,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'AAPL',
      price: 110,
    });

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      symbol: 'AAPL',
      market_price: 110,
      net_quantity: 15,
      active_trades: 2,
      total_market_value: 1650,
      total_unrealized_pnl: 125,
    });
  });

  it('aggregates BUY and SELL trades for the same symbol', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
      {
        symbol: 'AAPL',
        side: 'SELL',
        quantity: 4,
        price: 120,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'AAPL',
      price: 110,
    });

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      net_quantity: 6,
      active_trades: 2,
      total_market_value: 1540,
      total_unrealized_pnl: 140,
    });
  });
  it('supports a negative net quantity', async () => {
    const repository = create_repository([
      {
        symbol: 'TSLA',
        side: 'BUY',
        quantity: 5,
        price: 300,
        status: 'ACTIVE',
      },
      {
        symbol: 'TSLA',
        side: 'SELL',
        quantity: 10,
        price: 350,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'TSLA',
      price: 325,
    });

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      net_quantity: -5,
    });
  });

  it('creates separate aggregates for different symbols', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
      {
        symbol: 'MSFT',
        side: 'BUY',
        quantity: 5,
        price: 200,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockImplementation((symbol: string) => {
      if (symbol === 'AAPL') {
        return {
          symbol,
          price: 110,
        };
      }

      if (symbol === 'MSFT') {
        return {
          symbol,
          price: 210,
        };
      }

      return undefined;
    });

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toHaveLength(2);

    expect(result.some(item => item.symbol === 'AAPL')).toBe(true);
    expect(result.some(item => item.symbol === 'MSFT')).toBe(true);
  });

  it('skips trades when market price is unavailable', async () => {
    const repository = create_repository([
      {
        symbol: 'UNKNOWN',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue(undefined);

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toEqual([]);
  });

  it('returns an empty array when there are no active trades', async () => {
    const repository = create_repository([]);

    const service = new ListTradesPerSymbol(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toEqual([]);

    expect(repository.list_all_by_status).toHaveBeenCalledWith('trader-1', 'ACTIVE');

    expect(get_market_price_mock).not.toHaveBeenCalled();
  });
});
