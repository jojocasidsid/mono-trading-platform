import type { Stock, StockPrice } from '@/types/stock';

import { apiClient } from './apiClient';

export async function listStocks(): Promise<Stock[]> {
  const response = await apiClient.get<{
    data: Stock[];
  }>('/api/stocks');

  return response.data.data;
}

export async function listStockPrices(): Promise<StockPrice[]> {
  const response = await apiClient.get<{
    data: StockPrice[];
  }>('/api/stocks/prices');

  return response.data.data;
}
