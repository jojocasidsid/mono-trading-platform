import { calculatePnl } from '@/lib/calculatePnl';
import { describe, expect, it } from 'vitest';

describe('calculatePnl', () => {
  it('calculates BUY profit correctly', () => {
    const result = calculatePnl({
      side: 'BUY',
      quantity: 10,
      tradePrice: 100,
      marketPrice: 110,
    });

    expect(result).toBe(100);
  });

  it('calculates BUY loss correctly', () => {
    const result = calculatePnl({
      side: 'BUY',
      quantity: 10,
      tradePrice: 100,
      marketPrice: 90,
    });

    expect(result).toBe(-100);
  });

  it('calculates SELL profit correctly', () => {
    const result = calculatePnl({
      side: 'SELL',
      quantity: 10,
      tradePrice: 100,
      marketPrice: 90,
    });

    expect(result).toBe(100);
  });

  it('calculates SELL loss correctly', () => {
    const result = calculatePnl({
      side: 'SELL',
      quantity: 10,
      tradePrice: 100,
      marketPrice: 110,
    });

    expect(result).toBe(-100);
  });

  it('returns zero when market price equals trade price', () => {
    const result = calculatePnl({
      side: 'BUY',
      quantity: 10,
      tradePrice: 100,
      marketPrice: 100,
    });

    expect(result).toBe(0);
  });
});
