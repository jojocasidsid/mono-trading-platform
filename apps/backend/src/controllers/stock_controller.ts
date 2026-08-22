import type { FastifyReply, FastifyRequest } from 'fastify';
import ListStockPricesService from '../services/stocks_services/list_stock_prices.js';
import ListStocksService from '../services/stocks_services/list_stocks_service.js';

export class StockController {
  list = async (_request: FastifyRequest, reply: FastifyReply) => {
    const service = new ListStocksService();

    const stocks = await service.execute();

    return reply.send({
      data: stocks,
    });
  };

  prices = async (_request: FastifyRequest, reply: FastifyReply) => {
    const service = new ListStockPricesService();

    const stock_prices = await service.execute();

    return reply.send({
      data: stock_prices,
    });
  };
}
