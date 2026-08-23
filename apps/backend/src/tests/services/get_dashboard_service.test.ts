import { beforeEach, describe, expect, it, vi } from 'vitest';

import type TradeRepository from '../../repositories/trade_repository.js';

const { get_market_price_mock } = vi.hoisted(() => ({
  get_market_price_mock: vi.fn(),
}));

vi.mock('../../providers/market_price_provider.js', () => ({
  get_market_price: get_market_price_mock,
}));

import GetDashboardService from '../../services/trade_services/get_dashboard_service.js';

describe('GetDashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const create_repository = (trades: unknown[] = [], cancelled = 0, closed = 0) => {
    return {
      list_all_by_status: vi.fn().mockResolvedValue(trades),

      count_by_status: vi.fn().mockResolvedValueOnce(cancelled).mockResolvedValueOnce(closed),
    };
  };

  it('calculates total unrealized P&L and market value', async () => {
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
        side: 'SELL',
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
          price: 190,
        };
      }

      return undefined;
    });

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.total_unrealized_pnl).toBe(150);
    expect(result.total_market_value).toBe(2050);
    expect(result.active_trades).toBe(2);
  });

  it('calculates BUY P&L correctly', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'AAPL',
      price: 110,
    });

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.total_unrealized_pnl).toBe(100);
    expect(result.total_market_value).toBe(1100);
  });

  it('calculates SELL P&L correctly', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'SELL',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'AAPL',
      price: 90,
    });

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.total_unrealized_pnl).toBe(100);
    expect(result.total_market_value).toBe(900);
  });

  it('calculates a loss correctly', async () => {
    const repository = create_repository([
      {
        symbol: 'AAPL',
        side: 'BUY',
        quantity: 10,
        price: 100,
        status: 'ACTIVE',
      },
    ]);

    get_market_price_mock.mockReturnValue({
      symbol: 'AAPL',
      price: 90,
    });

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.total_unrealized_pnl).toBe(-100);
  });

  it('returns the correct trade counts', async () => {
    const repository = create_repository([], 3, 5);

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.active_trades).toBe(0);
    expect(result.cancelled_trades).toBe(3);
    expect(result.closed_trades).toBe(5);
  });

  it('skips trades without a market price', async () => {
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

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result.total_unrealized_pnl).toBe(0);
    expect(result.total_market_value).toBe(0);

    // It is still an ACTIVE trade.
    expect(result.active_trades).toBe(1);
  });

  it('returns zero totals when there are no active trades', async () => {
    const repository = create_repository([]);

    const service = new GetDashboardService(repository as unknown as TradeRepository);

    const result = await service.execute('trader-1');

    expect(result).toEqual({
      total_unrealized_pnl: 0,
      total_market_value: 0,
      active_trades: 0,
      cancelled_trades: 0,
      closed_trades: 0,
    });

    expect(get_market_price_mock).not.toHaveBeenCalled();
  });
});
