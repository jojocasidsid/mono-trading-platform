import { get_market_price } from '../../providers/market_price_provider.js';

import TradeRepository from '../../repositories/trade_repository.js';

interface AggregatedSymbol {
  symbol: string;
  market_price: number;
  net_quantity: number;
  active_trades: number;
  total_market_value: number;
  total_unrealized_pnl: number;
}

export default class ListTradesPerSymbol {
  constructor(private readonly trade_repository = new TradeRepository()) {}

  async execute(trader_id: string): Promise<AggregatedSymbol[]> {
    const active_trades = await this.trade_repository.list_all_by_status(trader_id, 'ACTIVE');

    const aggregated = new Map<string, AggregatedSymbol>();

    for (const trade of active_trades) {
      const stock_price = get_market_price(trade.symbol);

      if (!stock_price) {
        continue;
      }

      const execution_price = Number(trade.price);

      const market_price = stock_price.price;

      const market_value = market_price * trade.quantity;

      const unrealized_pnl =
        trade.side === 'BUY'
          ? (market_price - execution_price) * trade.quantity
          : (execution_price - market_price) * trade.quantity;

      const net_quantity = trade.side === 'BUY' ? trade.quantity : -trade.quantity;

      const current = aggregated.get(trade.symbol);

      if (current) {
        current.net_quantity += net_quantity;
        current.active_trades += 1;
        current.total_market_value += market_value;
        current.total_unrealized_pnl += unrealized_pnl;
        current.market_price = market_price;

        continue;
      }

      aggregated.set(trade.symbol, {
        symbol: trade.symbol,
        market_price,
        net_quantity,
        active_trades: 1,
        total_market_value: market_value,
        total_unrealized_pnl: unrealized_pnl,
      });
    }

    return Array.from(aggregated.values())
      .map(item => ({
        ...item,

        market_price: Number(item.market_price.toFixed(2)),

        total_market_value: Number(item.total_market_value.toFixed(2)),

        total_unrealized_pnl: Number(item.total_unrealized_pnl.toFixed(2)),
      }))
      .sort((a, b) => Math.abs(b.total_unrealized_pnl) - Math.abs(a.total_unrealized_pnl));
  }
}
