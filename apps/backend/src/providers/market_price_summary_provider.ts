import GetDashboardService from '../services/trade_services/get_dashboard_service.js';

import { broadcast_to_trader, get_connected_trader_ids } from '../shared/websocket/websocket.js';

import type { MarketPriceSummaryUpdatedEvent } from '../shared/websocket/websocket_events.js';

export async function publish_market_price_summaries(): Promise<void> {
  const trader_ids = get_connected_trader_ids();

  if (trader_ids.length === 0) {
    return;
  }

  await Promise.all(
    trader_ids.map(async trader_id => {
      try {
        const service = new GetDashboardService();

        const dashboard = await service.execute(trader_id);

        const event: MarketPriceSummaryUpdatedEvent = {
          total_unrealized_pnl: dashboard.total_unrealized_pnl,

          total_market_value: dashboard.total_market_value,

          updated_at: new Date(),
        };

        broadcast_to_trader(trader_id, 'MARKET_PRICE_SUMMARY_UPDATED', event);
      } catch (error) {
        console.error(`Failed to publish market price summary for trader ${trader_id}`, error);
      }
    })
  );
}
