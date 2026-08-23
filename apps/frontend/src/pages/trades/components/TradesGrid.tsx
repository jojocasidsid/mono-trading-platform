import { memo, useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';

import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
  type SortChangedEvent,
} from 'ag-grid-community';

import { Button } from '@/components/ui/button';

import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';

import type { StockPrice } from '@/types/stock';
import type { Trade } from '@/types/trade';

import TradeActions from './TradeActions';
import { calculatePnl } from '@/lib/calculatePnl';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TradesGridProps {
  data: Trade[];
  stockPrices: StockPrice[];

  isLoading: boolean;
  isFetching: boolean;

  page: number;
  total: number;
  totalPages: number;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc';

  onPageChange: (page: number) => void;

  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const TradeActionsCell = memo(function TradeActionsCell(params: ICellRendererParams<Trade>) {
  if (!params.data) {
    return null;
  }

  return <TradeActions trade={params.data} />;
});

export default function TradesGrid({
  data,
  stockPrices,
  isLoading,
  isFetching,
  page,
  total,
  totalPages,
  sortBy,
  sortOrder,
  onPageChange,
  onSortChange,
}: TradesGridProps) {
  const priceMap = useMemo(
    () => new Map(stockPrices.map(stock => [stock.symbol, stock.price])),
    [stockPrices]
  );

  const columnDefs = useMemo<ColDef<Trade>[]>(
    () => [
      {
        field: 'symbol',
        headerName: 'Symbol',
        minWidth: 100,
        maxWidth: 100,
      },

      {
        headerName: 'P/L',
        colId: 'pnl',
        minWidth: 140,
        maxWidth: 140,
        sortable: false,

        valueGetter: params => {
          const trade = params.data;

          if (!trade || trade.status !== 'ACTIVE') {
            return null;
          }

          const marketPrice = priceMap.get(trade.symbol);

          if (marketPrice === undefined) {
            return null;
          }

          return calculatePnl({
            side: trade.side,

            quantity: trade.quantity,

            tradePrice: Number(trade.price),

            marketPrice,
          });
        },

        valueFormatter: params => {
          if (params.value === null || params.value === undefined) {
            return '-';
          }

          return formatCurrency(Number(params.value));
        },

        cellClass: params => {
          const value = Number(params.value ?? 0);

          if (value > 0) {
            return 'font-medium text-green-600';
          }

          if (value < 0) {
            return 'font-medium text-red-600';
          }

          return 'font-medium';
        },
      },

      {
        field: 'side',
        headerName: 'Side',
        minWidth: 100,
        maxWidth: 100,
        cellClass: params =>
          params.value === 'BUY' ? 'text-green-600 font-medium' : 'text-red-600 font-medium',
      },

      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 100,
        maxWidth: 100,
      },

      {
        field: 'price',
        headerName: 'Trade Price',

        valueFormatter: params => formatCurrency(Number(params.value)),
      },

      {
        headerName: 'Market Price',
        colId: 'marketPrice',
        minWidth: 140,
        maxWidth: 140,
        sortable: false,

        cellRenderer: (params: ICellRendererParams<Trade>) => {
          if (!params.data) {
            return '-';
          }

          const stockPrice = stockPrices.find(stock => stock.symbol === params.data?.symbol);

          if (!stockPrice) {
            return '-';
          }

          const previousPrice = stockPrice?.previous_price;

          const direction =
            previousPrice === undefined
              ? 'neutral'
              : stockPrice.price > previousPrice
                ? 'up'
                : stockPrice.price < previousPrice
                  ? 'down'
                  : 'neutral';

          return (
            <div
              key={`${stockPrice.symbol}-${stockPrice.price}`}
              className={
                direction === 'up'
                  ? 'animate-price-up rounded px-2'
                  : direction === 'down'
                    ? 'animate-price-down rounded px-2'
                    : 'px-2'
              }
            >
              {formatCurrency(stockPrice.price)}
            </div>
          );
        },
      },

      {
        field: 'status',
        headerName: 'Status',
        minWidth: 130,
        maxWidth: 160,
        flex: 0.7,

        cellRenderer: (params: ICellRendererParams<Trade>) => {
          const status = params.data?.status;

          if (!status) {
            return null;
          }

          const className =
            status === 'ACTIVE'
              ? 'bg-green-500/10 text-green-600'
              : status === 'CLOSED'
                ? 'bg-blue-500/10 text-blue-600'
                : 'bg-red-500/10 text-red-600';

          return (
            <div className="flex h-full items-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
              >
                {status}
              </span>
            </div>
          );
        },
      },
      {
        field: 'tradeTimestamp',
        headerName: 'Trade Time',

        valueFormatter: params => (params.value ? formatDate(params.value) : '-'),
      },

      {
        headerName: 'Actions',
        colId: 'actions',

        minWidth: 200,
        maxWidth: 200,

        sortable: false,
        resizable: false,

        cellRenderer: TradeActionsCell,
      },
    ],
    [priceMap]
  );

  const defaultColDef = useMemo<ColDef<Trade>>(
    () => ({
      flex: 1,
      minWidth: 110,
      resizable: true,
      sortable: true,
    }),
    []
  );

  const handleSortChanged = (event: SortChangedEvent<Trade>) => {
    const state = event.api.getColumnState();

    const sortedColumn = state.find(column => column.sort !== null);

    if (!sortedColumn || !sortedColumn.sort) {
      return;
    }

    if (
      sortedColumn.colId === 'marketPrice' ||
      sortedColumn.colId === 'pnl' ||
      sortedColumn.colId === 'actions'
    ) {
      return;
    }

    onSortChange(sortedColumn.colId, sortedColumn.sort);
  };

  const initialState = useMemo(
    () => ({
      sort: {
        sortModel:
          sortBy && sortOrder
            ? [
                {
                  colId: sortBy,
                  sort: sortOrder,
                },
              ]
            : [],
      },
    }),
    [sortBy, sortOrder]
  );

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg border">
        <AgGridReact<Trade>
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          initialState={initialState}
          loading={isLoading}
          rowHeight={48}
          headerHeight={44}
          onSortChanged={handleSortChanged}
          domLayout="autoHeight"
          suppressCellFocus
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {isFetching ? 'Updating...' : `${total} ${total === 1 ? 'trade' : 'trades'}`}
        </p>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          <span className="min-w-24 text-center text-sm">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
