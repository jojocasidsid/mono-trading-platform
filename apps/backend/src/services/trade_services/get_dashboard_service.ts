import { get_market_price } from '../../providers/market_price_provider.js';
import TradeRepository from '../../repositories/trade_repository.js';

export interface DashboardModel {
  total_unrealized_pnl: number;
  total_market_value: number;
  active_trades: number;
  cancelled_trades: number;
  closed_trades: number;
}

export default class GetDashboardService {
  constructor(private readonly trade_repository = new TradeRepository()) {}

  async execute(trader_id: string): Promise<DashboardModel> {
    const [active_trades, cancelled_trades, closed_trades] = await Promise.all([
      this.trade_repository.list_all_by_status(trader_id, 'ACTIVE'),

      this.trade_repository.count_by_status(trader_id, 'CANCELLED'),

      this.trade_repository.count_by_status(trader_id, 'CLOSED'),
    ]);

    let total_unrealized_pnl = 0;
    let total_market_value = 0;

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

      total_market_value += market_value;

      total_unrealized_pnl += unrealized_pnl;
    }

    return {
      total_unrealized_pnl: Number(total_unrealized_pnl.toFixed(2)),

      total_market_value: Number(total_market_value.toFixed(2)),

      active_trades: active_trades.length,

      cancelled_trades,

      closed_trades,
    };
  }
}
