import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  create_trade_schema,
  update_trade_schema,
  type CreateTradeRequest,
  type UpdateTradeRequest,
} from '@fusion/shared';

import { ApplicationController } from './application_controller.js';

import CreateTradeService from '../services/trade_services/create_trade_service.js';
import ListTradesService from '../services/trade_services/list_trades_service.js';
import UpdateTradeService from '../services/trade_services/update_trade_service.js';
import CancelTradeService from '../services/trade_services/cancel_trade_service.js';
import CloseTradeService from '../services/trade_services/close_trade_service.js';

import type { ListTradesModel } from '../models/trade_model.js';

import GetDashboardService from '../services/trade_services/get_dashboard_service.js';
import ListTradesPerSymbol from '../services/trade_services/list_trades_per_symbol.js';

export interface TradeParams {
  id: string;
}

export class TradeController extends ApplicationController {
  list = async (
    request: FastifyRequest<{
      Querystring: ListTradesModel;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const service = new ListTradesService();

    const result = await service.execute(trader_id, request.query);

    return reply.send(result);
  };

  create = async (
    request: FastifyRequest<{
      Body: CreateTradeRequest;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const input = create_trade_schema.parse(request.body);

    const service = new CreateTradeService();

    const trade = await service.execute(trader_id, input);

    return reply.status(201).send({
      data: trade,
    });
  };

  update = async (
    request: FastifyRequest<{
      Params: TradeParams;
      Body: UpdateTradeRequest;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const input = update_trade_schema.parse(request.body);

    const service = new UpdateTradeService();

    const trade = await service.execute(request.params.id, trader_id, input);

    return reply.send({
      data: trade,
    });
  };

  cancel = async (
    request: FastifyRequest<{
      Params: TradeParams;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const service = new CancelTradeService();

    const trade = await service.execute(request.params.id, trader_id);

    return reply.send({
      data: trade,
    });
  };

  close = async (
    request: FastifyRequest<{
      Params: TradeParams;
    }>,
    reply: FastifyReply
  ) => {
    const trader_id = this.get_trader_id(request);

    const service = new CloseTradeService();

    const trade = await service.execute(request.params.id, trader_id);

    return reply.send({
      data: trade,
    });
  };

  summary = async (request: FastifyRequest, reply: FastifyReply) => {
    const trader_id = this.get_trader_id(request);

    const service = new GetDashboardService();

    const summary = await service.execute(trader_id);

    return reply.send({
      data: summary,
    });
  };

  listTradesPerSymbol = async (request: FastifyRequest, reply: FastifyReply) => {
    const trader_id = this.get_trader_id(request);

    const service = new ListTradesPerSymbol();

    const pnl = await service.execute(trader_id);

    return reply.send({
      data: pnl,
    });
  };
}
