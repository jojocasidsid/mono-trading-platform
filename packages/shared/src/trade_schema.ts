// packages/shared/src/trade/trade_schema.ts

import { z } from 'zod';

export const create_trade_schema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1, 'Symbol is required.')
    .max(10, 'Symbol must not exceed 10 characters.')
    .transform(value => value.toUpperCase()),

  side: z.enum(['BUY', 'SELL']),

  quantity: z
    .number()
    .int('Quantity must be a whole number.')
    .positive('Quantity must be greater than zero.'),

  price: z.number().positive('Price must be greater than zero.'),

  book: z
    .string()
    .trim()
    .min(1, 'Book is required.')
    .max(100, 'Book must not exceed 100 characters.'),

  counterparty: z
    .string()
    .trim()
    .min(1, 'Counterparty is required.')
    .max(100, 'Counterparty must not exceed 100 characters.'),
});

export const update_trade_schema = z
  .object({
    symbol: z
      .string()
      .trim()
      .min(1, 'Symbol is required.')
      .max(10, 'Symbol must not exceed 10 characters.')
      .transform(value => value.toUpperCase())
      .optional(),

    side: z.enum(['BUY', 'SELL']).optional(),

    quantity: z
      .number()
      .int('Quantity must be a whole number.')
      .positive('Quantity must be greater than zero.')
      .optional(),

    price: z.number().positive('Price must be greater than zero.').optional(),

    book: z
      .string()
      .trim()
      .min(1, 'Book is required.')
      .max(100, 'Book must not exceed 100 characters.')
      .optional(),

    counterparty: z
      .string()
      .trim()
      .min(1, 'Counterparty is required.')
      .max(100, 'Counterparty must not exceed 100 characters.')
      .optional(),

    trade_timestamp: z.coerce.date().optional(),
  })
  .refine(input => Object.keys(input).length > 0, {
    message: 'At least one field must be provided.',
  });

export type CreateTradeRequest = z.infer<typeof create_trade_schema>;

export type UpdateTradeFormInput = z.input<typeof update_trade_schema>;

export type UpdateTradeRequest = z.output<typeof update_trade_schema>;
