import { useEffect, useMemo, useRef } from 'react';

import { AgGridReact } from 'ag-grid-react';

import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';

import { formatCurrency } from '@/lib/formatCurrency';

import type { AggregatedPnl } from '@/types/trade';

ModuleRegistry.registerModules([AllCommunityModule]);

interface PnlGridProps {
  data: AggregatedPnl[];
  isLoading: boolean;
  isFetching: boolean;
}

export default function PnlGrid({ data, isLoading, isFetching }: PnlGridProps) {
  const previousDataRef = useRef<Map<string, AggregatedPnl>>(new Map());

  const previousData = previousDataRef.current;

  const columnDefs = useMemo<ColDef<AggregatedPnl>[]>(
    () => [
      {
        field: 'symbol',
        headerName: 'Symbol',
        minWidth: 120,
        maxWidth: 140,
      },

      {
        field: 'net_quantity',
        headerName: 'Net Quantity',
        minWidth: 140,

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
        field: 'active_trades',
        headerName: 'Active Trades',
        minWidth: 140,
      },

      {
        field: 'market_price',
        headerName: 'Market Price',
        minWidth: 150,

        valueFormatter: params => formatCurrency(Number(params.value)),
      },

      {
        field: 'total_market_value',
        headerName: 'Market Value',
        minWidth: 170,

        cellRenderer: (params: ICellRendererParams<AggregatedPnl>) => {
          if (!params.data) {
            return '-';
          }

          const current = params.data.total_market_value;

          const previous = previousData.get(params.data.symbol)?.total_market_value;

          const direction =
            previous === undefined
              ? 'neutral'
              : current > previous
                ? 'up'
                : current < previous
                  ? 'down'
                  : 'neutral';

          return (
            <div
              key={`${params.data.symbol}-${current}`}
              className={
                direction === 'up'
                  ? 'animate-price-up rounded px-2'
                  : direction === 'down'
                    ? 'animate-price-down rounded px-2'
                    : 'px-2'
              }
            >
              {formatCurrency(current)}
            </div>
          );
        },
      },

      {
        field: 'total_unrealized_pnl',
        headerName: 'Unrealized P/L',
        minWidth: 170,

        cellRenderer: (params: ICellRendererParams<AggregatedPnl>) => {
          if (!params.data) {
            return '-';
          }

          const current = params.data.total_unrealized_pnl;

          const previous = previousData.get(params.data.symbol)?.total_unrealized_pnl;

          const direction =
            previous === undefined
              ? 'neutral'
              : current > previous
                ? 'up'
                : current < previous
                  ? 'down'
                  : 'neutral';

          const valueClass =
            current > 0
              ? 'font-medium text-green-600'
              : current < 0
                ? 'font-medium text-red-600'
                : 'font-medium';

          return (
            <div
              key={`${params.data.symbol}-${current}`}
              className={
                direction === 'up'
                  ? `animate-price-up rounded px-2 ${valueClass}`
                  : direction === 'down'
                    ? `animate-price-down rounded px-2 ${valueClass}`
                    : `px-2 ${valueClass}`
              }
            >
              {formatCurrency(current)}
            </div>
          );
        },
      },
    ],
    [previousData]
  );

  useEffect(() => {
    previousDataRef.current = new Map(data.map(item => [item.symbol, item]));
  }, [data]);

  const defaultColDef = useMemo<ColDef<AggregatedPnl>>(
    () => ({
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="w-full min-w-0 overflow-x-auto rounded-lg border">
        <div className="min-w-[900px]">
          <AgGridReact<AggregatedPnl>
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            loading={isLoading}
            rowHeight={48}
            headerHeight={44}
            domLayout="autoHeight"
            suppressCellFocus
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {isFetching ? 'Updating...' : `${data.length} ${data.length === 1 ? 'symbol' : 'symbols'}`}
      </p>
    </div>
  );
}
