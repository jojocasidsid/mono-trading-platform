import { useState } from 'react';

import useStockPrices from '@/hooks/stocks/useStockPrices';

import useTrades from '@/hooks/trades/useTrades';
import useTradeSummary from '@/hooks/trades/useTradeSummary';

import type { TradeListParams, TradeSide, TradeStatus } from '@/types/trade';

import CreateTradeDialog from './components/CreateTradeDialog';
import TradeFilters from './components/TradeFilters';
import TradesGrid from './components/TradesGrid';
import TradeSummary from './components/TradeSummary';

const PER_PAGE = 20;

const initialFilters: TradeListParams = {
  page: 1,
  perPage: PER_PAGE,
  sortBy: 'trade_timestamp',
  sortOrder: 'desc',
};

export default function TradesPage() {
  const [filters, setFilters] = useState<TradeListParams>(initialFilters);

  const {
    data: tradesData,
    isLoading: isTradesLoading,
    isFetching: isTradesFetching,
    isError: isTradesError,
    refetch: refetchTrades,
  } = useTrades(filters);

  const { data: summary, isLoading: isSummaryLoading } = useTradeSummary();

  const { data: stockPrices = [], isLoading: isStockPricesLoading } = useStockPrices();

  const handlePageChange = (page: number) => {
    setFilters(current => ({
      ...current,
      page,
    }));
  };

  const handleSymbolChange = (symbol?: string) => {
    setFilters(current => ({
      ...current,
      page: 1,
      symbol,
    }));
  };

  const handleSideChange = (side?: TradeSide) => {
    setFilters(current => ({
      ...current,
      page: 1,
      side,
    }));
  };

  const handleStatusChange = (status?: TradeStatus) => {
    setFilters(current => ({
      ...current,
      page: 1,
      status,
    }));
  };

  const handleBookChange = (book?: string) => {
    setFilters(current => ({
      ...current,
      page: 1,
      book,
    }));
  };

  const handleCounterpartyChange = (counterparty?: string) => {
    setFilters(current => ({
      ...current,
      page: 1,
      counterparty,
    }));
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(current => ({
      ...current,
      page: 1,
      sortBy,
      sortOrder,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  if (isTradesError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border">
        <div className="space-y-1 text-center">
          <p className="font-medium">Failed to load trades</p>

          <p className="text-sm text-muted-foreground">
            Something went wrong while loading your trades.
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-medium underline underline-offset-4"
          onClick={() => {
            void refetchTrades();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const trades = tradesData?.data ?? [];

  const total = tradesData?.pagination?.total ?? 0;

  const totalPages = tradesData?.pagination?.total_pages ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Trades</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your trades and monitor live market performance.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <CreateTradeDialog />
        </div>
      </div>

      <TradeSummary data={summary} isLoading={isSummaryLoading} />

      <TradeFilters
        filters={filters}
        onSymbolChange={handleSymbolChange}
        onSideChange={handleSideChange}
        onStatusChange={handleStatusChange}
        onBookChange={handleBookChange}
        onCounterpartyChange={handleCounterpartyChange}
        onReset={handleResetFilters}
      />

      <TradesGrid
        data={trades}
        stockPrices={stockPrices}
        isLoading={isTradesLoading || isStockPricesLoading}
        isFetching={isTradesFetching}
        page={filters.page ?? 1}
        total={total}
        totalPages={totalPages}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
