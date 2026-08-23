export interface Stock {
  symbol: string;
  name: string;
}

export interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  previous_price?: number;
  updated_at?: string;
}
