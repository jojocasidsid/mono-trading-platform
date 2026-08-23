import { formatCurrency } from '@/lib/formatCurrency';
import { describe, expect, it } from 'vitest';

describe('formatCurrency', () => {
  it('formats positive currency correctly', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats negative currency correctly', () => {
    expect(formatCurrency(-1234.5)).toBe('-$1,234.50');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats decimal values to two decimal places', () => {
    expect(formatCurrency(10.1234)).toBe('$10.12');
  });

  it('formats large values with separators', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});
