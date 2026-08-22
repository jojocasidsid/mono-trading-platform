import type { FastifyReply, FastifyRequest } from 'fastify';

import { ApplicationController } from './application_controller.js';
import ListTradeHistoryService from '../services/trade_history_services/list_trade_histories_service.js';

interface TradeHistoryQuery {
  page?: number;
  per_page?: number;
}

export class TradeHistoryController extends ApplicationController {
  list = async (
    request: FastifyRequest<{
      Querystring: TradeHistoryQuery;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const service = new ListTradeHistoryService();

    const result = await service.execute(trader_id, request.query);

    return reply.send(result);
  };
}
