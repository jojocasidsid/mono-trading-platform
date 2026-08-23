import ListTradesPerSymbol from '../services/trade_services/list_trades_per_symbol.js';
import { broadcast_to_trader, get_connected_trader_ids } from '../shared/websocket/websocket.js';

import type { AggregatedPnlUpdatedEvent } from '../shared/websocket/websocket_events.js';

export async function publish_aggregated_pnl(): Promise<void> {
  const trader_ids = get_connected_trader_ids();

  if (trader_ids.length === 0) {
    return;
  }

  await Promise.all(
    trader_ids.map(async trader_id => {
      try {
        const service = new ListTradesPerSymbol();

        const pnl = await service.execute(trader_id);

        const event: AggregatedPnlUpdatedEvent = {
          data: pnl,
          updated_at: new Date(),
        };

        broadcast_to_trader(trader_id, 'AGGREGATED_PNL_UPDATED', event);
      } catch (error) {
        console.error(`Failed to publish aggregated P/L for trader ${trader_id}`, error);
      }
    })
  );
}
