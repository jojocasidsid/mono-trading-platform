import { formatDate } from '@/lib/formatDate';
import { describe, expect, it } from 'vitest';

describe('formatDate', () => {
  it('formats a valid date', () => {
    const result = formatDate('2026-08-23T16:12:11.863Z');

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('returns a formatted value for a Date object', () => {
    const date = new Date('2026-08-23T16:12:11.863Z');

    const result = formatDate(date);

    expect(result).toBeTruthy();
  });
});
