import { nyse_100_stocks, SeedStock } from '../../../prisma/seed-data/stocks.js';

export default class ListStocksService {
  async execute(): Promise<SeedStock[]> {
    return nyse_100_stocks;
  }
}
