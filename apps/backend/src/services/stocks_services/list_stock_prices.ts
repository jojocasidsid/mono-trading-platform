import { get_market_prices, MarketPrice } from '../../providers/market_price_provider.js';

export default class ListStockPricesService {
  async execute(): Promise<MarketPrice[]> {
    return get_market_prices();
  }
}
